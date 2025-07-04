import { FormData, InputData } from "../interfaces/index.js";
import { makeFormFiled } from "./index.js";

export const makeForm = (formData: FormData) => {
	const form = document.createElement("form");
	form.className = "w-full";
	const formTitleH3 = document.createElement("h3");
	formTitleH3.textContent = formData.title ?? "";
	formTitleH3.className = "text-4xl text-white dark:text-white mb-6";
	form.appendChild(formTitleH3);

	formData.sections.map((sectionForm) => {
		const div = document.createElement("div");
		div.className = "mb-5 w-full";

		const h3 = document.createElement("h3");
		h3.textContent = sectionForm.sectionName;
		h3.className = "text-xl text-white dark:text-white";
		div.appendChild(h3);

		sectionForm.inputs.map((input: InputData) => {
			const formField = makeFormFiled(input);
			div.appendChild(formField);
		});

		form.appendChild(div);
	});

	const footerFormDiv = document.createElement("div");
	footerFormDiv.className = "flex justify-between";

	if (formData.cancelButton) {
		const cancelButton = document.createElement("button");
		cancelButton.type = "button";
		cancelButton.textContent = formData.cancelButton;
		cancelButton.className =
			"rounded-md bg-red-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
		cancelButton.addEventListener("click", () => {
			formData.cancelAction ? formData.cancelAction() : {};
		});

		footerFormDiv.appendChild(cancelButton);
	}

	const submitButton = document.createElement("button");
	submitButton.textContent = formData.submitButton;
	submitButton.type = "submit";
	submitButton.className =
		"rounded-md bg-purple-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-purple-700 focus:shadow-none active:bg-purple-700 hover:bg-purple-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-auto";
	footerFormDiv.appendChild(submitButton);

	form.addEventListener("submit", (e: SubmitEvent) => {
		e.preventDefault();
		formData.submitAction(e);
	});

	form.appendChild(footerFormDiv);
	return form;
};
