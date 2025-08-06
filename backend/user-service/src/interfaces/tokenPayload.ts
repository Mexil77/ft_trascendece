import { TokenPurpose } from "../enums/index.js";

export interface TokenPayload {
	userId: string;
	userName: string;
	email: string;
	purpose: TokenPurpose;
}
