import { InputData } from "../interfaces/index.js";

export const makeFormFiled = (input: InputData) => {
	const formField = document.createElement("div");
	formField.className = "flex flex-col mb-4 w-full ";

	const formFieldLabel = document.createElement("label");
	formFieldLabel.className = "text-white text-sm";
	formFieldLabel.textContent = input.label;
	formFieldLabel.htmlFor = input.id;
	formField.appendChild(formFieldLabel);

	const inputHtml = document.createElement("input");
	inputHtml.className =
		" border border-sky-500 focus:outline-none focus:border-emerald-500 px-3 py-2 rounded-md";
	inputHtml.placeholder = input.placeholder;
	inputHtml.type = `${input.type}`;
	inputHtml.id = input.id;

	formField.appendChild(inputHtml);
	return formField;
};
