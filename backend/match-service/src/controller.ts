import {
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
} from "fastify";
import { MatchService } from "./service.js";
import { CreateMatchDto } from "./interfaces/index.js";

export const MatchController = (fastify: FastifyInstance) => {
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
			req: FastifyRequest<{ Body: CreateMatchDto }>,
			rep: FastifyReply
		) => {
			return MatchService.createMatch(req, rep);
		}
	);
};
