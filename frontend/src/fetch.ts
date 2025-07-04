import { ApiFetchData } from "./interfaces/index.js";

export const apiFetch = async ({
	url,
	method,
	headers,
	body,
}: ApiFetchData) => {
	let fetchConfig: RequestInit = {
		method,
		...(headers ? { headers } : {}),
		...(body ? { body: JSON.stringify(body) } : {}),
	};
	return await fetch(`http://localhost:3000/api/${url}`, fetchConfig);
};
