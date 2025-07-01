import crypto from "crypto";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserDto } from "./interfaces/index.js";
import { ErrorCodes } from "./enums/index.js";

function hashPassword(password: string) {
	const salt = crypto.randomBytes(32).toString("hex");
	const hash = crypto
		.pbkdf2Sync(password, salt, 100000, 64, "sha512")
		.toString("hex");

	return {
		salt: salt,
		hash: hash,
	};
}

export default async function createQR() {
	const secret = speakeasy.generateSecret();
	const qrcode = await QRCode.toDataURL(secret.otpauth_url as string);
	const data = {
		sr: secret,
		qr: qrcode,
	};
	return data;
}

export class UserService {
	static async getUser(
		req: FastifyRequest<{ Params: { userId: string } }>,
		rep: FastifyReply
	) {
		try {
			const { userId } = req.params;
			const db = req.server.db;
			const query = db.prepare("SELECT * FROM users WHERE id = ?");
			const user = query.get(userId);
			if (!user) throw { code: ErrorCodes.USERNOTFOUND };
			return rep.code(200).send({ data: user });
		} catch (error: any) {
			if (error.code === ErrorCodes.USERNOTFOUND) {
				throw {
					message: "error.auth.userNotFound",
					statusCode: 404,
				};
			}
			return {
				message: "error.auth.unexpectedError",
				statusCode: 500,
			};
		}
	}

	static async createUser(
		req: FastifyRequest<{ Body: CreateUserDto }>,
		rep: FastifyReply
	) {
		try {
			const { userName, email, password, confirmPassword } = req.body;
			if (password !== confirmPassword) {
				throw { code: ErrorCodes.PASSWORDNOTMATCH };
			}
			const passwordStruct = hashPassword(password);

			const db = req.server.db;
			const query = db.prepare(
				"INSERT INTO users (username, email, password, salt) VALUES (?, ?, ?, ?)"
			);

			query.run(
				userName,
				email,
				passwordStruct.hash,
				passwordStruct.salt
			);

			const data = await createQR();
			const queryQr = db.prepare(
				"UPDATE users SET qrSecret = ? WHERE username = ?"
			);
			queryQr.run(data.sr.base32, userName);

			rep.send({ message: "Generate QR", QR: data.qr });
		} catch (error: any) {
			if (error.code === ErrorCodes.PASSWORDNOTMATCH) {
				throw {
					message: "error.auth.passwordNotMatch",
					statusCode: 400,
				};
			}
			if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
				throw {
					message: "error.auth.alreadyExist",
					statusCode: 409,
				};
			}
			return {
				message: "error.auth.unexpectedError",
				statusCode: 500,
			};
		}
	}
}
