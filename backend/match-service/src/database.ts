import fp from "fastify-plugin";
import Database from "better-sqlite3";
import { FastifyInstance } from "fastify";

function dbConnector(fastify: FastifyInstance) {
	const dbFile = "/data/matches.db";
	const db = new Database(dbFile, { verbose: console.log });

	db.pragma("journal_mode = WAL");
	db.pragma("foreign_keys = ON");

	db.exec(`
    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      player1Id TEXT NOT NULL,
      player2Id TEXT NOT NULL,
      player1Name TEXT NOT NULL,
      player2Name TEXT NOT NULL,
      score1 INTEGER NOT NULL,
      score2 INTEGER NOT NULL,
      limitScore INTEGER NOT NULL,
      limitTime REAL NOT NULL,
      matchTime REAL NOT NULL
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
