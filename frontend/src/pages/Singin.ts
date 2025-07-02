import { makeForm } from "../components/index.js";
import { FormTypes } from "../enums/index.js";
import { FormData } from "../interfaces/index.js";
import { NavigateTo } from "../router.js";

const singinForm: FormData = {
	title: "Singin",
	submitButton: "Crear cuenta",
	submitAction: async (e: SubmitEvent) => {
		try {
			const form = e.target as HTMLFormElement;

			const formData = new FormData(form);

			const userName = formData.get("userName");
			const email = formData.get("email");
			const password = formData.get("password");
			const confirmPassword = formData.get("confirmPassword");

			await fetch("http://localhost:3000/api/users/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					userName,
					email,
					password,
					confirmPassword,
				}),
			});
			localStorage.setItem("userValidate", userName as string);
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
