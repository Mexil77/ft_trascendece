import { Player } from "./index.js";

export class Ball {
	posX: number = 0;
	posY: number = 0;
	radius: number = 0;
	speed: number = 0;
	velocityX: number = 0;
	velocityY: number = 0;
	color: string = "";

	constructor(
		posX: number,
		posY: number,
		radius: number,
		speed: number,
		velocityX: number,
		velocityY: number,
		color: string
	) {
		this.posX = posX;
		this.posY = posY;
		this.radius = radius;
		this.speed = speed;
		this.velocityX = velocityX;
		this.velocityY = velocityY;
		this.color = color;
	}

	moveBall() {
		this.posX += this.velocityX;
		this.posY += this.velocityY;
	}

	colidePoint(colideX: number, colideY: number) {
		return (
			colideX > this.posX - this.radius &&
			colideX < this.posX + this.radius &&
			colideY > this.posY - this.radius &&
			colideY < this.posY + this.radius
		);
	}

	colideBorderBoard(canvasHeight: number) {
		if (
			this.colidePoint(this.posX, 0) ||
			this.colidePoint(this.posX, canvasHeight)
		)
			this.velocityY *= -1;
	}

	playerColided(
		playerLeft: Player,
		playerRight: Player
	): Player | null {
		if (playerLeft.colidePoint(this.posX - this.radius, this.posY)) {
			return playerLeft;
		}
		if (playerRight.colidePoint(this.posX + this.radius, this.posY)) {
			return playerRight;
		}
		return null;
	}

	drawBall(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
		ctx.closePath();
		ctx.fill();
	}
}
