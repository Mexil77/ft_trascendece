import { makeForm } from "../components/index.js";
import { FetchMethods, FormTypes } from "../enums/index.js";
import { apiFetch } from "../fetch.js";
import { FormData } from "../interfaces/index.js";
import { NavigateTo } from "../router.js";

const singinForm: FormData = {
	title: "Singin",
	submitButton: "Crear cuenta",
	submitAction: async (e: SubmitEvent) => {
		try {
			const form = e.target as HTMLFormElement;

			const formData = new FormData(form);

			const userName = formData.get("userName") as string;
			const email = formData.get("email") as string;
			const password = formData.get("password") as string;
			const confirmPassword = formData.get(
				"confirmPassword"
			) as string;

			const tmpToken = await apiFetch({
				url: "http://localhost:3000/api/users/",
				headers: { "Content-type": "application/json" },
				method: FetchMethods.POST,
				body: {
					userName,
					email,
					password,
					confirmPassword,
				},
			});
			const tmpTokenData = await tmpToken.json();
			localStorage.setItem("tmpToken", tmpTokenData.tempToken);

			NavigateTo("/validate");
		} catch (error) {
			console.error(error);
		}
	},
	sections: [
		{
			sectionName: "Datos",
			inputs: [
				{
					type: FormTypes.TEXT,
					label: "Nombre",
					placeholder: "Nombre",
					id: "userName",
					name: "userName",
				},
				{
					type: FormTypes.EMAIL,
					label: "Correo",
					placeholder: "Correo",
					id: "email",
					name: "email",
				},
				{
					type: FormTypes.PASSWORD,
					label: "password",
					placeholder: "Contrasena",
					id: "password",
					name: "password",
				},
				{
					type: FormTypes.PASSWORD,
					label: "Confirm password",
					placeholder: "Repetir contrasena",
					id: "confirmPassword",
					name: "confirmPassword",
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
