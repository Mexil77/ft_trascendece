import { FastifyReply, FastifyRequest } from "fastify";
import { ErrorCodes, TokenPurpose } from "./enums/index.js";
import {
	generateSecret,
	hashPassword,
	createWebToken,
	otpVerificationCode,
	constructQRByData,
	verifyPassword,
} from "./utils/index.js";
import { CreateUserDto } from "./interfaces/index.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "default_dev_secret";

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
		req: FastifyRequest<{
			Headers: { authorization: string };
		}>,
		rep: FastifyReply
	) {
		try {
			const token = req.headers.authorization.replace(
				/^Bearer\s+/i,
				""
			);

			const payload = jwt.verify(token, JWT_SECRET) as {
				userName: string;
				email: string;
				[key: string]: any;
			};

			const { userName } = payload;

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
			const tmpToken = createWebToken(
				{
					userName,
					email,
					purpose: TokenPurpose.AWAITING_OTP,
				},
				600
			);

			rep.send({ message: "UserCreated", tmpToken });
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

	static async authUser(
		req: FastifyRequest<{
			Body: { userName: string; password: string };
		}>,
		rep: FastifyReply
	) {
		try {
			const { userName, password } = req.body;

			const db = req.server.db;

			const queryUserCredentials = db.prepare(
				"SELECT password,salt,email from users WHERE username = ?"
			);
			const userDataCredentials: any =
				queryUserCredentials.get(userName);

			if (!userDataCredentials)
				throw { code: ErrorCodes.USERNOTFOUND };
			if (
				!verifyPassword(
					password,
					userDataCredentials.salt,
					userDataCredentials.password
				)
			)
				throw { code: ErrorCodes.WRONGPASSWORD };

			const tmpToken = createWebToken(
				{
					userName,
					email: userDataCredentials.email,
					purpose: TokenPurpose.AWAITING_OTP,
				},
				600
			);

			rep.send({ message: "UserAuth", tmpToken });
		} catch (error: any) {
			if (error.code === ErrorCodes.USERNOTFOUND) {
				throw {
					message: "error.auth.userNotFound",
					statusCode: 404,
				};
			}
			if (error.code === ErrorCodes.WRONGPASSWORD) {
				throw {
					message: "error.auth.wrongPassword",
					statusCode: 400,
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
			Body: { otpCode: string };
			Headers: { authorization: string };
		}>,
		rep: FastifyReply
	) {
		try {
			const token = req.headers.authorization.replace(
				/^Bearer\s+/i,
				""
			);

			const payload = jwt.verify(token, JWT_SECRET) as {
				userName: string;
				email: string;
				[key: string]: any;
			};

			const { userName, email } = payload;
			const { otpCode } = req.body;

			const db = req.server.db;

			const query = db.prepare(
				"SELECT qrSecret FROM users WHERE username = ?"
			);
			const userInfo: any = query.get(userName);

			if (!otpVerificationCode(userInfo.qrSecret, otpCode)) {
				throw { code: "Not verify" };
			}
			const userToken = createWebToken(
				{
					userName,
					email,
					purpose: TokenPurpose.AUTH,
				},
				86400
			);
			rep.code(200).send({
				message: "Verified OTP Code",
				token: userToken,
			});
		} catch (error: any) {
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
