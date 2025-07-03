import { makeForm } from "../components/Form.js";
import { FetchMethods, FormTypes } from "../enums/index.js";
import { apiFetch } from "../fetch.js";
import { FormData } from "../interfaces/index.js";
import { NavigateTo } from "../router.js";

const getQR = async () => {
	try {
		const res = await apiFetch({
			url: "http://localhost:3000/api/users/generateQR",
			headers: {
				authorization: `Bearer ${localStorage.getItem("tmpToken")}`,
			},
			method: FetchMethods.GET,
		});
		const data = await res.json();
		return data;
	} catch (error) {
		console.error(error);
		return null;
	}
};

const validateTmpToken = () => {
	const tmpToken = localStorage.getItem("tmpToken");
	if (!tmpToken) {
		NavigateTo("/");
	}
	return tmpToken;
};

const validateCodeForm: FormData = {
	title: "Codigo de validacion",
	submitButton: "Enviar codigo",
	submitAction: async (e: SubmitEvent) => {
		try {
			const form = e.target as HTMLFormElement;

			const formData = new FormData(form);

			const otpCode = formData.get("otpCode") as string;

			const res = await apiFetch({
				url: "http://localhost:3000/api/users/verify",
				headers: {
					"Content-Type": "application/json",
					authorization: `Bearer ${localStorage.getItem("tmpToken")}`,
				},
				method: FetchMethods.POST,
				body: {
					otpCode,
				},
			});
			const data = await res.json();
			localStorage.setItem("authToken", data.token);
			localStorage.removeItem("tmpToken");
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
	if (!validateTmpToken()) return validationPageDiv;

	validationPageDiv.className =
		"mx-auto flex flex-col max-w-lg items-center gap-x-4 rounded-xl bg-white p-4 shadow-lg outline outline-black/5 dark:bg-slate-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10";

	const title = document.createElement("h2");
	title.textContent = "Validacion";
	validationPageDiv.appendChild(title);

	const imgQR = document.createElement("img");
	(async () => {
		const qrImage = await getQR();
		imgQR.src = qrImage.QR;
	})();
	validationPageDiv.appendChild(imgQR);

	const form = makeForm(validateCodeForm);
	validationPageDiv.appendChild(form);

	return validationPageDiv;
};
