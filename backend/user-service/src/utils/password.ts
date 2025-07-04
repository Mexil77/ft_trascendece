import crypto from "crypto";

export const hashPassword = (password: string) => {
	const salt = crypto.randomBytes(32).toString("hex");
	const hash = crypto
		.pbkdf2Sync(password, salt, 100000, 64, "sha512")
		.toString("hex");

	return {
		salt: salt,
		hash: hash,
	};
};

export const verifyPassword = (
	password: string,
	salt: string,
	hash: string
): boolean => {
	const hashToVerify = crypto
		.pbkdf2Sync(password, salt, 100000, 64, "sha512")
		.toString("hex");

	return hash === hashToVerify;
};
