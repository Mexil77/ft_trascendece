import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
} from "fastify";
import { MatchService } from "./service.js";
import { CreateMatchDto } from "./interfaces/index.js";

export const MatchController = (fastify: FastifyInstance) => {
	fastify.get(
		"/",
		async (
			req: FastifyRequest<{ Headers: { authorization: string } }>,
			rep: FastifyReply
		) => {
			return MatchService.getMatches(req, rep);
		}
	);

	fastify.get(
		"/:matchId",
		async (
			req: FastifyRequest<{ Params: { matchId: string } }>,
			rep: FastifyReply
		) => {
			return MatchService.getMatch(req, rep);
		}
	);

	fastify.post(
		"/",
		async (
			req: FastifyRequest<{
				Body: CreateMatchDto;
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
			return MatchService.createMatch(req, rep);
		}
	);
};
