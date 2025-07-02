import { FastifyReply, FastifyRequest } from "fastify";
import { ErrorCodes } from "./enums/index.js";
import {
	generateSecret,
	hashPassword,
	createWebToken,
	otpVerificationCode,
	constructQRByData,
} from "./utils/index.js";
import { CreateUserDto } from "./interfaces/index.js";

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

	static async generateQR(
		req: FastifyRequest<{ Body: { userName: string } }>,
		rep: FastifyReply
	) {
		try {
			const { userName } = req.body;

			const db = req.server.db;
			const query = db.prepare(
				"SELECT qrSecret FROM users WHERE userName = ?"
			);
			const secret: any = query.get(userName);

			const qr = await constructQRByData(secret.qrSecret);
			rep.code(200).send({ message: "QrGenerated", QR: qr });
		} catch (error) {
			return { message: "error.auth.unexpectedError", code: 500 };
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

			const secret = await generateSecret();
			const updateQrSecretQuery = db.prepare(
				"UPDATE users SET qrSecret = ? WHERE username = ?"
			);
			updateQrSecretQuery.run(secret.base32, userName);

			rep.send({ message: "UserCreated" });
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

	static async verifyUser(
		req: FastifyRequest<{
			Body: { userName: string; otpCode: string };
		}>,
		rep: FastifyReply
	) {
		try {
			const { userName, otpCode } = req.body;

			const db = req.server.db;

			const query = db.prepare(
				"SELECT qrSecret, email FROM users WHERE username = ?"
			);
			const userInfo: any = query.get(userName);

			if (!otpVerificationCode(userInfo.qrSecret, otpCode)) {
				throw { code: "Not verify" };
			}
			const userToken = createWebToken(userName, userInfo.email);
			rep.code(200).send({
				message: "Verified OTP Code",
				token: userToken,
			});
		} catch (error: any) {
			console.error(error);

			if (error.code === "Not verify") {
				throw {
					message: "error.auth.notVerify",
					statusCode: 404,
				};
			}
			return {
				message: "error.auth.unexpectedError",
				statusCode: 500,
			};
		}
	}
}
