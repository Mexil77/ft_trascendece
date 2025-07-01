import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
} from "fastify";
import { UserService } from "./service.js";
import { CreateUserDto } from "./interfaces/index.js";

export const UserController = (fastify: FastifyInstance) => {
	fastify.get(
		"/:userId",
		async (
			req: FastifyRequest<{ Params: { userId: string } }>,
			rep: FastifyReply
		) => {
			return UserService.getUser(req, rep);
		}
	);
	fastify.post(
		"/",
		async (
			req: FastifyRequest<{ Body: CreateUserDto }>,
			rep: FastifyReply
		) => {
			return UserService.createUser(req, rep);
		}
	);
};
