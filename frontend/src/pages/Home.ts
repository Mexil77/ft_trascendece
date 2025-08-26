import { Table } from "../components/index.js";
import { FetchMethods } from "../enums/fetchMethods.js";
import { apiFetch } from "../fetch.js";
import { NavigateTo } from "../router.js";

const cardButtons = ["Local", "En linea", "Multijugador"];

const getMatches = async () => {
	try {
		const res = await apiFetch({
			url: "matches/",
			headers: {
				authorization: `Bearer ${localStorage.getItem("authToken")}`,
			},
			method: FetchMethods.GET,
		});
		const data = await res.json();
		return data.data;
	} catch (error) {
		console.error(error);
		return null;
	}
};

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
		"border rounded-md border-white border-dashed w-full text-white text-xl flex-col justify-center items-center";

	(async () => {
		const matches = await getMatches();
		if (!matches) {
			statsDiv.className += " h-48";
			statsDiv.textContent = "No tienes estadisticas aun";
		} else {
			statsSectionDiv.appendChild(
				Table(
					[
						"Jugador1",
						"Puntaje1",
						"Puntaje2",
						"Jugador2",
						"Puntos a ganar",
						"Tiempo limitre",
						"Tiempo jugado",
					],
					matches
				)
			);
		}
	})();

	pageDiv.appendChild(statsSectionDiv);
	return pageDiv;
};
