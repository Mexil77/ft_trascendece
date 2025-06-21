import { Route } from "./interfaces/index.js";
import { LoginPage, SingInPage, HomePage } from "./pages/index.js";

const routes: Route[] = [
	{
		path: "/",
		component: HomePage(),
		protected: true,
	},
	{
		path: "/login",
		component: LoginPage(),
		protected: false,
	},
	{
		path: "/singin",
		component: SingInPage(),
		protected: false,
	},
];

const isAuth = () => {
	return localStorage.getItem("authToken");
};

const render = () => {
	const app = document.getElementById("app");
	if (!app) return;

	app.innerHTML = "";

	const path = window.location.pathname;

	const notFound404 = document.createElement("div");
	notFound404.innerHTML = "<h2>404 - Página no encontrada</h2>";
	const route = routes.find((route: Route) => route.path === path);
	if (!route) {
		app.appendChild(notFound404);
		return;
	}

	if (route.protected && !isAuth()) {
		NavigateTo("/login");
		return;
	}

	app.appendChild(route.component);
};

export const NavigateTo = (path: string) => {
	window.history.pushState({}, "", path);
	render();
};
