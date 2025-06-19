import Fastify, {
	FastifyInstance,
	RouteShorthandOptions,
} from "fastify";
import cors from "@fastify/cors";
import { Server, IncomingMessage, ServerResponse } from "http";

const server: FastifyInstance = Fastify({ logger: true });

const opts: RouteShorthandOptions = {
	schema: {
		response: {
			200: {
				type: "object",
				properties: {
					pong: {
						type: "string",
					},
				},
			},
		},
	},
};

server.get("/ping", opts, async (request, reply) => {
	return { pong: "it worked" };
});

const start = async () => {
	try {
		await server.register(cors, { origin: "*" });
		const port = Number(process.env.PORT) || 3002;
		server.listen({ port, host: "0.0.0.0" }, (err, address) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			console.log(`🚀 Server running at ${address}`);
		});

		// const address = server.server.address();
		// const port =
		// 	typeof address === "string" ? address : address?.port;
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

start();
