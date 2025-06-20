import { FormTypes } from "../enums/index.js";

export interface InputData {
	type: FormTypes;
	label: string;
	id: string;
	placeholder: string;
}

export interface SectionData {
	sectionName: string;
	inputs: InputData[];
}

export interface FormData {
	title?: string;
	submitButton: string;
	cancelButton?: string;
	sections: SectionData[];
	submitAction: () => void;
	cancelAction?: () => void;
}
