import jwt from "jsonwebtoken";

export const createWebToken = (userName: string, email: string) => {
	const payload = {
		userName,
		email,
	};
	// const options = {
	// 	expiresIn: "1h",
	// 	algorithm: "HS256",
	// };
	const token = jwt.sign(payload, "JWT_SECRET"); // put secret con env
	return token;
};
