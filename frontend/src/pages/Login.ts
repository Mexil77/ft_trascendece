import { makeForm } from "../components/index.js";
import { FetchMethods, FormTypes } from "../enums/index.js";
import { apiFetch } from "../fetch.js";
import { FormData } from "../interfaces/index.js";
import { NavigateTo } from "../router.js";

const loginForm: FormData = {
	title: "Login",
	submitButton: "Iniciar sesion",
	submitAction: async (e: SubmitEvent) => {
		const form = e.target as HTMLFormElement;

		const formData = new FormData(form);

		const userName = formData.get("userName") as string;
		const password = formData.get("password") as string;

		const tmpToken = await apiFetch({
			url: "users/authUser",
			method: FetchMethods.POST,
			headers: { "Content-type": "application/json" },
			body: { userName, password },
		});
		const tmpTokenData = await tmpToken.json();
		localStorage.setItem("tmpToken", tmpTokenData.tmpToken);

		NavigateTo("/validate");
	},
	sections: [
		{
			sectionName: "Datos",
			inputs: [
				{
					type: FormTypes.TEXT,
					label: "Nombre de usuario",
					placeholder: "nombre de usuario",
					id: "userName",
					name: "userName",
				},
				{
					type: FormTypes.PASSWORD,
					label: "Password",
					placeholder: "****...",
					id: "password",
					name: "password",
				},
			],
		},
	],
};

export const LoginPage = () => {
	const div = document.createElement("div");
	div.className =
		"mx-auto flex flex-col max-w-lg gap-x-4 rounded-xl bg-white p-4 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10";
	const form = makeForm(loginForm);
	div.appendChild(form);
	const cancelButton = document.createElement("button");
	cancelButton.type = "button";
	cancelButton.textContent = "singin";
	cancelButton.className =
		"rounded-md w-xl bg-lime-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-lime-700 focus:shadow-none active:bg-lime-700 hover:bg-lime-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
	cancelButton.addEventListener("click", () => {
		NavigateTo("/singin");
	});
	div.appendChild(cancelButton);
	return div;
};
