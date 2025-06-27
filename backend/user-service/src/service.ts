import { FastifyRequest } from "fastify";

export class UserService {
	static async getUser(req: FastifyRequest, userId: string) {
		try {
			const db = req.server.db;
			const query = db.prepare("SELECT * FROM users");
			// const query = db.prepare(
			// 	"INSERT INTO users (username) VALUES (?)"
			// );
			// query.run("ema");
			console.log(query.get());

			return { user: query.get(), userId };
		} catch (error) {
			console.error(error);
		}
	}
}
