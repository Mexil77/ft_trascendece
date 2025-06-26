import { Directions } from "../enums/index.js";

export class Player {
	posX: number = 0;
	posY: number = 0;
	width: number = 0;
	height: number = 0;
	speed: number = 0;
	color: string = "";
	score: string = "";
	sideBoard: Directions = Directions.LEFT;

	constructor(
		posX: number,
		posY: number,
		width: number,
		height: number,
		speed: number,
		color: string,
		score: string,
		sideBoard: Directions
	) {
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = height;
		this.speed = speed;
		this.color = color;
		this.score = score;
		this.sideBoard = sideBoard;
	}

	moveUp() {
		this.posY -= this.speed;
	}

	moveDown() {
		this.posY += this.speed;
	}

	colidePoint(colideX: number, colideY: number) {
		return (
			colideX > this.posX &&
			colideX < this.posX + this.width &&
			colideY > this.posY &&
			colideY < this.posY + this.height
		);
	}

	colideBorderBoard(canvasHeight: number) {
		if (this.colidePoint(this.posX + 1, 0)) this.posY = 0;
		if (this.colidePoint(this.posX + 1, canvasHeight))
			this.posY = canvasHeight - this.height;
	}
}
