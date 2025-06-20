import { Navbar } from "./components/index.js";
import { NavigateTo } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
	window.addEventListener("popstate", () => {
		NavigateTo(window.location.pathname);
	});

	NavigateTo(window.location.pathname);
	const app = document.getElementById("app");
	document.body.insertBefore(Navbar(), app);
});
