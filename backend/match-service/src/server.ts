import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { MatchController } from "./controller.js";
import dbConnector from "./database.js";

const server: FastifyInstance = Fastify({ logger: true });

server.setErrorHandler((error, _, reply) => {
	reply.code(error.statusCode ?? 500).send(error.message);
});

const connectionSettings = {
	host: "0.0.0.0",
	port: Number(process.env.PORT) || 3002,
};

const start = async () => {
	try {
		await server.register(cors, {
			origin: "*",
			methods: ["GET", "POST", "PUT", "DELETE"],
			allowedHeaders: ["Content-type", "Authorization"],
			credentials: false,
		});
		await server.register(MatchController);
		await server.register(dbConnector);
		server.listen(connectionSettings, (err, address) => {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			console.log(`🚀 Server running at ${address}`);
		});
	} catch (err) {
		server.log.error(err);
		process.exit(1);
	}
};

start();
