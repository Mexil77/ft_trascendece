import { makeForm } from "../components/index.js";
import { FormTypes } from "../enums/index.js";
import { FormData } from "../interfaces/index.js";
import { NavigateTo } from "../router.js";

const singinForm: FormData = {
	title: "Singin",
	submitButton: "Crearr cuenta",
	submitAction: () => {
		NavigateTo("/login");
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
				},
				{
					type: FormTypes.EMAIL,
					label: "Correo",
					placeholder: "Correo",
					id: "Correo1",
				},
				{
					type: FormTypes.PASSWORD,
					label: "password",
					placeholder: "Contrasena",
					id: "password",
				},
			],
		},
	],
};

export const SingInPage = () => {
	const singinPageDiv = document.createElement("div");
	singinPageDiv.className =
		"mx-auto flex max-w-lg items-center gap-x-4 rounded-xl bg-white p-4 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10";
	const form = makeForm(singinForm);
	singinPageDiv.appendChild(form);
	return singinPageDiv;
};
