import { FetchMethods } from "../enums/index.js";

export interface ApiFetchData {
	url: string;
	method: FetchMethods;
	headers?: Record<string, string>;
	body?: Record<string, string>;
}
