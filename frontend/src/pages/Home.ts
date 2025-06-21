import { NavigateTo } from "../router.js";

export const HomePage = () => {
	const pageDiv = document.createElement("div");
	const title = document.createElement("h1");
	title.textContent = "Home";
	pageDiv.appendChild(title);
	const button = document.createElement("button");
	button.textContent = "login";
	button.addEventListener("click", () => {
		NavigateTo("/login");
	});
	pageDiv.appendChild(button);
	const logOut = document.createElement("button");
	logOut.textContent = "logout";
	logOut.className = "bg-red-500";
	logOut.addEventListener("click", () => {
		localStorage.removeItem("authToken");
		NavigateTo("/");
	});
	pageDiv.appendChild(logOut);
	return pageDiv;
};
