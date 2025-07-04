import { TokenPurpose } from "../enums/index.js";

export interface TokenPayload {
	userName: string;
	email: string;
	purpose: TokenPurpose;
}
