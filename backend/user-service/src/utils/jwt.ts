import jwt, { SignOptions } from "jsonwebtoken";
import { TokenPayload } from "../interfaces/index.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "default_dev_secret";

export const createWebToken = (
	payload: TokenPayload,
	expiresInSeconds: number = 900
) => {
	const options: SignOptions = {
		expiresIn: expiresInSeconds,
		algorithm: "HS256",
	};
	const token = jwt.sign(payload, JWT_SECRET, options);
	return token;
};
