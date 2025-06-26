import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { UserController } from "./controller.js";

const server: FastifyInstance = Fastify({ logger: true });

const connectionSettings = {
	host: "0.0.0.0",
	port: Number(process.env.PORT) || 3002,
};

const start = async () => {
	try {
		await server.register(cors, {
			origin: "*",
			methods: ["GET", "POST", "PUT", "DELETE"],
			allowedHeaders: ["Context-type", "Authorization"],
			credentials: false,
		});
		await server.register(UserController);
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
