export const ConfigGamePage = () => {
	const ConfigGamePageDiv = document.createElement("div");
	ConfigGamePageDiv.className =
		"w-full text-white text-4xl flex bg-slate-800 p-8";

	const controlsSectionDiv = document.createElement("div");
	controlsSectionDiv.className =
		"w-1/2 border rounded-md border-white gap-4 flex flex-col p-4";

	const controlMaxPointsDiv = document.createElement("div");
	controlMaxPointsDiv.className = "w-full flex justify-between";

	const nameLabelMaxPoint = document.createElement("label");
	nameLabelMaxPoint.textContent = "Maximo de puntos";

	const buttonSubstractPoint = document.createElement("button");
	buttonSubstractPoint.className =
		"bg-gray-500 rounded-md hover:bg-sky-400 hover:cursor-poninter text-2xl size-9";
	buttonSubstractPoint.textContent = "-";

	const buttonAddPoint = document.createElement("button");
	buttonAddPoint.className =
		"bg-gray-500 rounded-md hover:bg-sky-400 hover:cursor-poninter text-2xl size-9";
	buttonAddPoint.textContent = "+";

	const labelMaxPoint = document.createElement("label");
	labelMaxPoint.className = "text-white text-md";
	labelMaxPoint.textContent = "1";

	controlMaxPointsDiv.appendChild(nameLabelMaxPoint);
	const maxPointsControlsDiv = document.createElement("div");
	maxPointsControlsDiv.className = "flex gap-4 items-center";
	maxPointsControlsDiv.appendChild(labelMaxPoint);
	maxPointsControlsDiv.appendChild(buttonSubstractPoint);
	maxPointsControlsDiv.appendChild(buttonAddPoint);
	controlMaxPointsDiv.appendChild(maxPointsControlsDiv);

	const controlMaxTimeDiv = document.createElement("div");
	controlMaxTimeDiv.className = "w-full flex justify-between";

	const nameLabelMaxTime = document.createElement("label");
	nameLabelMaxTime.textContent = "Maximo de Tiempo";

	const buttonSubstractTime = document.createElement("button");
	buttonSubstractTime.className =
		"bg-gray-500 rounded-md hover:bg-sky-400 hover:cursor-poninter text-2xl size-9";
	buttonSubstractTime.textContent = "-";

	const buttonAddTime = document.createElement("button");
	buttonAddTime.className =
		"bg-gray-500 rounded-md hover:bg-sky-400 hover:cursor-poninter text-2xl size-9";
	buttonAddTime.textContent = "+";

	const labelMaxTime = document.createElement("label");
	labelMaxTime.className = "text-white text-md";
	labelMaxTime.textContent = "1:00";

	controlMaxTimeDiv.appendChild(nameLabelMaxTime);
	const maxTimeControlsDiv = document.createElement("div");
	maxTimeControlsDiv.className = "flex gap-4 items-center";
	maxTimeControlsDiv.appendChild(labelMaxTime);
	maxTimeControlsDiv.appendChild(buttonSubstractTime);
	maxTimeControlsDiv.appendChild(buttonAddTime);
	controlMaxTimeDiv.appendChild(maxTimeControlsDiv);

	controlsSectionDiv.appendChild(controlMaxPointsDiv);
	controlsSectionDiv.appendChild(controlMaxTimeDiv);
	ConfigGamePageDiv.appendChild(controlsSectionDiv);
	return ConfigGamePageDiv;
};
