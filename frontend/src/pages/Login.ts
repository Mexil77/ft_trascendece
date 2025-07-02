import { makeForm } from "../components/index.js";
import { FormTypes } from "../enums/index.js";
import { FormData } from "../interfaces/index.js";
import { NavigateTo } from "../router.js";

const loginForm: FormData = {
	title: "Login",
	submitButton: "Iniciar sesion",
	submitAction: (e: SubmitEvent) => {
		localStorage.setItem("authToken", "testtoken");
		NavigateTo("/");
	},
	sections: [
		{
			sectionName: "Datos",
			inputs: [
				{
					type: FormTypes.TEXT,
					label: "Nombre",
					placeholder: "Nombre",
					id: "Nombre1",
					name: "Nombre1",
				},
				{
					type: FormTypes.EMAIL,
					label: "Correo",
					placeholder: "Correo",
					id: "Correo1",
					name: "Correo1",
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
