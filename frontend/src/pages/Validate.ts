import { makeForm } from "../components/Form.js";
import { FormTypes } from "../enums/index.js";
import { FormData } from "../interfaces/index.js";
import { NavigateTo } from "../router.js";

const getQR = async () => {
	try {
		const userName = localStorage.getItem("userValidate");

		const res = await fetch(
			"http://localhost:3000/api/users/generateQR",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userName: userName }),
			}
		);
		const data = await res.json();
		return data;
	} catch (error) {}
};

const validateValidation = () => {
	const userName = localStorage.getItem("userValidate");
	if (!userName) {
		NavigateTo("/");
	}
	return userName;
};

const validateCodeForm: FormData = {
	title: "Codigo de validacion",
	submitButton: "Enviar codigo",
	submitAction: async (e: SubmitEvent) => {
		try {
			const form = e.target as HTMLFormElement;

			const formData = new FormData(form);

			const otpCode = formData.get("otpCode");

			const res = await fetch(
				"http://localhost:3000/api/users/verify",
				{
					method: "POST",
					headers: { "Content-type": "application/json" },
					body: JSON.stringify({
						userName: localStorage.getItem("userValidate"),
						otpCode,
					}),
				}
			);
			const data = await res.json();
			localStorage.setItem("authToken", data.token);
			localStorage.removeItem("userValidate");
			NavigateTo("/");
		} catch (error) {
			console.error(error);
		}
	},
	sections: [
		{
			sectionName: "",
			inputs: [
				{
					type: FormTypes.NUMBER,
					label:
						"Ingresa el codigo de tu aplicacion de autenticacion",
					placeholder: "234...",
					id: "otpCode",
					name: "otpCode",
				},
			],
		},
	],
};

export const ValidatePage = () => {
	const validationPageDiv = document.createElement("div");
	if (!validateValidation()) return validationPageDiv;
	validationPageDiv.className =
		"mx-auto flex flex-col max-w-lg items-center gap-x-4 rounded-xl bg-white p-4 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10";

	const title = document.createElement("h2");
	title.textContent = "Validacion";
	validationPageDiv.appendChild(title);

	const imgQR = document.createElement("img");
	(async () => {
		const data: any = await getQR();
		imgQR.src = data.QR;
	})();
	validationPageDiv.appendChild(imgQR);

	const form = makeForm(validateCodeForm);
	validationPageDiv.appendChild(form);

	return validationPageDiv;
};
