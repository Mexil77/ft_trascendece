import { NavigateTo } from "../router.js";

enum ButtonControls {
	SUBSTRACT = "substract",
	ADD = "add",
}

enum ControlType {
	MAXPOINTS = "maxpoints",
	MAXTIME = "maxtime",
}
interface ControlConfig {
	id: ControlType;
	label: string;
	value: string;
	action: (action: ButtonControls) => void;
}

const isValidTimeFormat = (cadena: string): boolean => {
	const regex = /^(?:[0-5]?\d):[0-5]\d$/;
	return regex.test(cadena);
};

function secondsToTimeFormat(totalSeconds: number): string {
	const minutos = Math.floor(totalSeconds / 60);
	const segundos = totalSeconds % 60;
	const mm = minutos.toString().padStart(2, "0");
	const ss = segundos.toString().padStart(2, "0");
	return `${mm}:${ss}`;
}

const controlsConfigGame: ControlConfig[] = [
	{
		id: ControlType.MAXPOINTS,
		label: "Maximo de puntos",
		value: "1",
		action: (action: ButtonControls) => {
			const label = document.getElementById(
				`${ControlType.MAXPOINTS}`
			);
			if (!label) return;
			let value = Number(label.textContent);
			if (!value || value < 1) {
				label.textContent = `1`;
				return;
			}
			if (action === ButtonControls.ADD) {
				label.textContent = `${++value}`;
			} else if (value > 1) {
				label.textContent = `${--value}`;
			}
		},
	},
	{
		id: ControlType.MAXTIME,
		label: "Maximo de timepo",
		value: "01:00",
		action: (action: ButtonControls) => {
			const label = document.getElementById(`${ControlType.MAXTIME}`);
			if (!label) return;
			if (
				!label.textContent ||
				!isValidTimeFormat(label.textContent)
			) {
				label.textContent = "01:00";
				return;
			}
			const [minuts, seconds] = label.textContent
				.split(":")
				.map(Number);
			let total = minuts * 60 + seconds;
			if (action === ButtonControls.ADD) {
				total += 15;
			} else if (total > 30) {
				total -= 15;
			}
			label.textContent = secondsToTimeFormat(total);
		},
	},
];

export const ConfigGamePage = () => {
	const ConfigGamePageDiv = document.createElement("div");
	ConfigGamePageDiv.className =
		"w-full text-white text-4xl flex bg-slate-800 p-8";

	const controlsSectionDiv = document.createElement("div");
	controlsSectionDiv.className =
		"w-1/2 border rounded-md border-white gap-4 flex flex-col p-4";

	controlsConfigGame.map((controlConfig: ControlConfig) => {
		const controlDiv = document.createElement("div");
		controlDiv.className = "w-full flex justify-between";

		const nameLabel = document.createElement("label");
		nameLabel.textContent = controlConfig.label;

		const buttonSubstract = document.createElement("button");
		buttonSubstract.className =
			"bg-gray-500 rounded-md hover:bg-sky-400 hover:cursor-poninter text-2xl size-9";
		buttonSubstract.textContent = "-";
		buttonSubstract.addEventListener("click", () =>
			controlConfig.action(ButtonControls.SUBSTRACT)
		);

		const buttonAdd = document.createElement("button");
		buttonAdd.className =
			"bg-gray-500 rounded-md hover:bg-sky-400 hover:cursor-poninter text-2xl size-9";
		buttonAdd.textContent = "+";
		buttonAdd.addEventListener("click", () =>
			controlConfig.action(ButtonControls.ADD)
		);

		const labelValue = document.createElement("label");
		labelValue.className = "text-white text-md";
		labelValue.textContent = controlConfig.value;
		labelValue.id = controlConfig.id;

		const actionsDiv = document.createElement("div");
		actionsDiv.className = "flex gap-4 items-center";

		controlDiv.appendChild(nameLabel);

		actionsDiv.appendChild(labelValue);
		actionsDiv.appendChild(buttonSubstract);
		actionsDiv.appendChild(buttonAdd);
		controlDiv.appendChild(actionsDiv);

		controlsSectionDiv.appendChild(controlDiv);
	});

	const startGameButton = document.createElement("button");
	startGameButton.classList =
		"p-2 text-xl bg-green-800 text-white hover:border hover:bg-green-600 rounded";
	startGameButton.textContent = "Empezar juego";
	startGameButton.addEventListener("click", () => {
		NavigateTo("/game");
	});

	controlsSectionDiv.appendChild(startGameButton);
	ConfigGamePageDiv.appendChild(controlsSectionDiv);
	return ConfigGamePageDiv;
};
