import { FastifyReply, FastifyRequest } from "fastify";
import { CreateMatchDto } from "./interfaces/index.js";
import { ErrorCodes } from "./enums/index.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "default_dev_secret";

export class MatchService {
	static async getMatch(
		req: FastifyRequest<{ Params: { matchId: string } }>,
		rep: FastifyReply
	) {
		try {
			const { matchId } = req.params;
			// const db = req.server.db;
			// const query = db.prepare("SELECT * FROM matchs WHERE id = ?");
			// const match = query.get(matchId);
			// if (!match) throw { code: ErrorCodes.USERNOTFOUND };
			return rep.code(200).send({ data: matchId });
		} catch (error: any) {
			// if (error.code === ErrorCodes.USERNOTFOUND) {
			// 	throw {
			// 		message: "error.auth.matchNotFound",
			// 		statusCode: 404,
			// 	};
			// }
			// return {
			// 	message: "error.auth.unexpectedError",
			// 	statusCode: 500,
			// };
		}
	}

	static async createMatch(
		req: FastifyRequest<{ Body: CreateMatchDto }>,
		rep: FastifyReply
	) {
		try {
			const {
				player1Id,
				player2Id,
				score1,
				score2,
				limitScore,
				limitTime,
				matchTime,
			} = req.body;
			console.log("req.body", req.body);

			const db = req.server.db;
			const query = db.prepare(
				"INSERT INTO matches (player1Id, player2Id, score1, score2, limitScore, limitTime, matchTime) VALUES (?, ?, ?, ?, ?, ?, ?)"
			);

			query.run(
				player1Id,
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
