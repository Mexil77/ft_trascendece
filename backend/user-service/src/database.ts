import fp from "fastify-plugin";
import Database from "better-sqlite3";
import { FastifyInstance } from "fastify";

function dbConnector(fastify: FastifyInstance) {
	const dbFile = "/data/users.db";
	const db = new Database(dbFile, { verbose: console.log });

	db.pragma("journal_mode = WAL");
	db.pragma("foreign_keys = ON");

	db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT,
      salt TEXT,
      qrSecret TEXT
    );
  `);

	//  Can access an instance of the DB from fastify
	fastify.decorate("db", db);

	// Creates a hook so the db closes at the same time that the server
	fastify.addHook("onClose", (_, done) => {
		db.close();
		done();
	});
}

export default fp(dbConnector);
