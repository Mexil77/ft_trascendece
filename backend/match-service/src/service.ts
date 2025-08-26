import { FastifyReply, FastifyRequest } from "fastify";
import { CreateMatchDto } from "./interfaces/index.js";
import { ErrorCodes } from "./enums/index.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET ?? "default_dev_secret";

export class MatchService {
	static async getMatch(
		req: FastifyRequest<{ Params: { matchId: string } }>,
		rep: FastifyReply
	) {
		try {
			const { matchId } = req.params;
			const db = req.server.db;
			const query = db.prepare("SELECT * FROM matches WHERE id = ?");
			const match = query.get(matchId);
			if (!match) throw { code: ErrorCodes.MATCHNOTFOUD };
			return rep.code(200).send({ data: match });
		} catch (error: any) {
			if (error.code === ErrorCodes.MATCHNOTFOUD) {
				throw {
					message: "error.match.matchNotFound",
					statusCode: 404,
				};
			}
			return {
				message: "error.match.unexpectedError",
				statusCode: 500,
			};
		}
	}

	static async getMatches(
		req: FastifyRequest<{ Headers: { authorization: string } }>,
		rep: FastifyReply
	) {
		try {
			const token = req.headers.authorization.replace(
				/^Bearer\s+/i,
				""
			);
			const { userId } = jwt.verify(token, JWT_SECRET) as {
				userId: string;
				userName: string;
				email: string;
				[key: string]: any;
			};

			const db = req.server.db;
			const query = db.prepare(
				"SELECT player1Name,score1,score2,player2Name,limitScore,limitTime,matchTime FROM matches WHERE player1Id = ?"
			);

			const matches = query.all(userId);
			rep.send({ data: matches });
		} catch (error) {
			console.error(error);
		}
	}

	static async createMatch(
		req: FastifyRequest<{
			Body: CreateMatchDto;
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
				userId: string;
				userName: string;
				email: string;
				[key: string]: any;
			};

			const {
				player1Id,
				player2Id,
				score1,
				score2,
				limitScore,
				limitTime,
				matchTime,
			} = req.body;

			// Esto se adaptara cuando se permita conectar una cuenta agena a la secion del jugador para registrar la partda
			// if (
			// 	!Object.values(DefaultPlayers).includes(
			// 		player1Id as DefaultPlayers
			// 	)
			// ) {
			// query al usuario correspondiente si es el caso
			// }
			// if (
			// 	!Object.values(DefaultPlayers).includes(
			// 		player2Id as DefaultPlayers
			// 	)
			// ) {
			// query al usuario correspondiente si es el caso
			// }

			const matchId = uuidv4();

			const db = req.server.db;
			const query = db.prepare(
				"INSERT INTO matches (id, player1Id, player2Id, player1Name, player2Name, score1, score2, limitScore, limitTime, matchTime) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
			);

			query.run(
				matchId,
				payload.userId,
				"",
				payload.userName,
				player2Id,
				score1,
				score2,
				limitScore,
				limitTime,
				matchTime
			);

			rep.send({ message: "MatchCreated" });
		} catch (error: any) {
			console.log(error);

			if (error.code === ErrorCodes.MATCHNOTCREATE) {
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
