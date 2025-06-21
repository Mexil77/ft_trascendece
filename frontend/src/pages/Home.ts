import { NavigateTo } from "../router.js";

const cardButtons = ["Local", "En linea", "Multijugador"];

export const HomePage = () => {
	const pageDiv = document.createElement("div");
	pageDiv.className = "h-auto flex flex-col bg-slate-800 p-4 gap-8";

	const constrolSectionDiv = document.createElement("div");
	constrolSectionDiv.className =
		"w-full gap-8 h-auto flex-col text-white";

	const titleSection = document.createElement("h2");
	titleSection.textContent = "Jugar";
	titleSection.className = "text-6xl mb-8";
	constrolSectionDiv.appendChild(titleSection);

	const buttonGridDiv = document.createElement("div");
	buttonGridDiv.className = "w-full flex justify-arround gap-6";

	cardButtons.map((cardButton: string) => {
		const cardOption = document.createElement("div");
		cardOption.className =
			"w-1/3 bg-gray-500 rounded-md flex justify-center items-center h-24 text-white text-4xl hover:bg-sky-400 hover:cursor-pointer";
		cardOption.textContent = cardButton;
		cardOption.addEventListener("click", () => {
			NavigateTo("/configGame");
		});
		buttonGridDiv.appendChild(cardOption);
	});
	constrolSectionDiv.appendChild(buttonGridDiv);
	pageDiv.appendChild(constrolSectionDiv);

	const statsSectionDiv = document.createElement("div");
	statsSectionDiv.className =
		"w-full gap-8 h-auto flex-col text-white";

	const titleStatsSection = document.createElement("h2");
	titleStatsSection.textContent = "Estadisticas";
	titleStatsSection.className = "text-6xl mb-8";
	statsSectionDiv.appendChild(titleStatsSection);

	const statsDiv = document.createElement("div");
	statsDiv.className =
		"border rounded-md border-white border-dashed w-full h-48 text-white text-xl flex justify-center items-center";
	statsDiv.textContent = "No tienes estadisticas aun";
	statsSectionDiv.appendChild(statsDiv);

	pageDiv.appendChild(statsSectionDiv);
	return pageDiv;
};
