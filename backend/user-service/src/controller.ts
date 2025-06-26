import { FastifyInstance, FastifyRequest } from "fastify";
import { UserService } from "./service.js";

export const UserController = (fastify: FastifyInstance) => {
	fastify.get(
		"/:userId",
		async (
			req: FastifyRequest<{ Params: { userId: string } }>,
			res
		) => {
			const { userId } = req.params;
			return UserService.getUser(userId);
		}
	);
};
