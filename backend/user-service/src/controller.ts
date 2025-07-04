import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
} from "fastify";
import { UserService } from "./service.js";
import {
	AuthUserDto,
	CreateUserDto,
	VerifyUserDto,
} from "./interfaces/index.js";

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

	fastify.post(
		"/authUser",
		async (
			req: FastifyRequest<{
				Body: AuthUserDto;
			}>,
			rep: FastifyReply
		) => {
			return UserService.authUser(req, rep);
		}
	);

	fastify.get(
		"/generateQR",
		async (
			req: FastifyRequest<{
				Headers: { authorization: string };
			}>,
			rep: FastifyReply
		) => {
			const authHeader = req.headers.authorization;
			if (!authHeader) {
				return rep
					.code(401)
					.send({ message: "error.auth.TokenNotFound" });
			}
			return UserService.generateQR(req, rep);
		}
	);

	fastify.post(
		"/verify",
		async (
			req: FastifyRequest<{
				Body: VerifyUserDto;
				Headers: { authorization: string };
			}>,
			rep: FastifyReply
		) => {
			const authHeader = req.headers.authorization;
			if (!authHeader) {
				return rep
					.code(401)
					.send({ message: "error.auth.TokenNotFound" });
			}
			return UserService.verifyUser(req, rep);
		}
	);
};
