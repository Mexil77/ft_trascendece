import { Game } from "../classes/index.js";

enum Orientation {
	VERTICAL = "vertical",
	HORIZONTAL = "horizontal",
}

export const GamePage = () => {
	const gamePageDiv = document.createElement("div");
	gamePageDiv.className = "w-full h-screen bg-green-800";

	if (Game.currentInstance) {
		Game.currentInstance.stopGame();
		Game.currentInstance = null;
	}

	// Crea la nueva instancia y guárdala en la propiedad estática
	const gameBoard = new Game(5, Orientation.HORIZONTAL);
	Game.currentInstance = gameBoard;
	gameBoard.startGame();

	gamePageDiv.appendChild(gameBoard.canvasGame);
	return gamePageDiv;
};
