import { makeForm } from "../components/index.js";
import { FormTypes } from "../enums/index.js";
import { FormData } from "../interfaces/index.js";
import { NavigateTo } from "../router.js";

const loginForm: FormData = {
	title: "Login",
	submitButton: "Iniciar sesion",
	submitAction: () => {
		localStorage.setItem("authToken", "testtoken");
		NavigateTo("/singin");
	},
	sections: [
		{
			sectionName: "Datos",
			inputs: [
				{
					type: FormTypes.text,
					label: "Nombre",
					placeholder: "Nombre",
					id: "Nombre1",
				},
				{
					type: FormTypes.email,
					label: "Correo",
					placeholder: "Correo",
					id: "Correo1",
				},
			],
		},
	],
};

export const LoginPage = () => {
	const div = document.createElement("div");
	div.className =
		"mx-auto flex max-w-lg items-center gap-x-4 rounded-xl bg-white p-4 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10";
	const form = makeForm(loginForm);
	div.appendChild(form);
	return div;
};
