import { Game } from "../classes/index.js";

enum Orientation {
	VERTICAL = "vertical",
	HORIZONTAL = "horizontal",
}

const getConfig = () => {
	const configGame = localStorage.getItem("configGame");
	localStorage.removeItem("configGame");
	return configGame
		? JSON.parse(configGame)
		: { maxPoints: 3, maxTime: "00:00" };
};

export const GamePage = () => {
	const gamePageDiv = document.createElement("div");
	gamePageDiv.className = "flex flex-wrap h-auto";

	const gameContainerDiv = document.createElement("div");
	gameContainerDiv.id = "containerCanvas";
	gameContainerDiv.className = "basis-2/3 w-full";
	// gameContainerDiv.className = "w-full max-w-3xl";

	if (Game.currentInstance) {
		Game.currentInstance.stopGame();
		Game.currentInstance = null;
	}

	const sendResultButton = document.createElement("button");
	sendResultButton.textContent = "Enviar resultados";

	sendResultButton.className =
		"rounded-md bg-purple-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-purple-700 focus:shadow-none active:bg-purple-700 hover:bg-purple-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-auto";

	(() => {
		const configGame = getConfig();
		console.log("configGame", configGame);

		// Crea la nueva instancia y guárdala en la propiedad estática
		const gameBoard = new Game(configGame, Orientation.HORIZONTAL);

		gameBoard.sendResultButton = sendResultButton;

		Game.currentInstance = gameBoard;
		gameBoard.startGame();

		gameContainerDiv.appendChild(gameBoard.canvasGame);
	})();

	const dataPlayersDiv = document.createElement("div");
	dataPlayersDiv.className =
		"bg-slate-400 border-solid border-2 rounded-md border-red-200 basis-1/3";
	const title = document.createElement("h1");
	title.textContent = "Titulo del juego";
	gamePageDiv.appendChild(gameContainerDiv);
	dataPlayersDiv.appendChild(title);

	dataPlayersDiv.appendChild(sendResultButton);

	gamePageDiv.appendChild(dataPlayersDiv);
	return gamePageDiv;
};
