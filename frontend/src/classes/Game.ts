import { Player, Ball } from "./index.js";
import {
	Orientation,
	Directions,
	FetchMethods,
	DefaultPlayers,
} from "../enums/index.js";
import { apiFetch } from "../fetch.js";

export class Game {
	MaxPoints = 0;
	canvasGame = document.createElement("canvas");
	ctx: CanvasRenderingContext2D | null;
	user: Player | null = null;
	cpu: Player | null = null;
	ball: Ball | null = null;
	orientation: Orientation | null = null;
	sendResultButton?: HTMLButtonElement;

	keys = {
		w: false,
		s: false,
	};

	constructor(maxPoints: number, orientation: Orientation) {
		this.MaxPoints = maxPoints;
		this.canvasGame.id = "pong";
		this.canvasGame.className = "w-full h-full";
		this.ctx = this.canvasGame.getContext("2d");

		this.orientation = orientation;
		this.user = new Player(
			localStorage.getItem("userName") ?? "",
			2,
			this.canvasGame.height / 2 - 50,
			2,
			40,
			7,
			"white",
			"0",
			Directions.LEFT
		);
		this.cpu = new Player(
			DefaultPlayers.CPU_PLAYER,
			this.canvasGame.width - 7,
			this.canvasGame.height / 2 - 50,
			2,
			40,
			7,
			"white",
			"0",
			Directions.RIGHT
		);
		this.ball = new Ball(
			this.canvasGame.width / 2,
			this.canvasGame.height / 2,
			3,
			3,
			3,
			3,
			"white"
		);

		document.addEventListener("keydown", (e) => {
			if (e.key === "w" || e.key === "W") this.keys.w = true;
			if (e.key === "s" || e.key === "S") this.keys.s = true;
		});

		// Detectar teclas soltadas
		document.addEventListener("keyup", (e) => {
			if (e.key === "w" || e.key === "W") this.keys.w = false;
			if (e.key === "s" || e.key === "S") this.keys.s = false;
		});
	}

	private intervalId: number | null = null;
	static currentInstance: Game | null = null;

	cleanScrean() {
		if (this.ctx) {
			this.ctx.fillStyle = "#000";
			this.ctx.fillRect(
				0,
				0,
				this.canvasGame.width,
				this.canvasGame.height
			);
		}
	}

	// Dibujar texto
	drawText(text: string, x: number, y: number, color: string) {
		if (this.ctx) {
			this.ctx.fillStyle = color;
			this.ctx.font = "45px Arial";
			this.ctx.fillText(text, x, y);
		}
	}

	// Control del jugador mouse
	// this.canvasGame.addEventListener("mousemove", (evt) => {
	// 	let rect = this.canvasGame.getBoundingClientRect();
	// 	user.y = evt.clientY - rect.top - user.height / 2;
	// });

	// Control del jugador teclado

	update = () => {
		if (this.keys.w) this.user?.moveUp();
		if (this.keys.s) this.user?.moveDown();

		// Limitar movimiento a los bordes
		this.user?.colideBorderBoard(this.canvasGame.height);

		this.ball?.moveBall();

		// rebote arriba/abajo
		this.ball?.colideBorderBoard(this.canvasGame.height);

		// CPU sigue la pelota
		if (this.cpu && this.ball)
			this.cpu.posY +=
				(this.ball.posY - (this.cpu.posY + this.cpu.height / 2)) *
				0.1;

		// colisión con jugador
		let playerColider: Player | null = null;
		if (this.ball && this.user && this.cpu) {
			playerColider = this.ball?.playerColided(this.user, this.cpu);
		}

		if (this.ball && playerColider) {
			// ángulo de rebote
			let collidePoint =
				this.ball.posY -
				(playerColider.posY + playerColider.height / 2);
			collidePoint = collidePoint / (playerColider.height / 2);

			let angleRad = (Math.PI / 4) * collidePoint;
			let direction =
				this.ball.posX < this.canvasGame.width / 2 ? 1 : -1;

			this.ball.velocityX =
				direction * this.ball.speed * Math.cos(angleRad);
			this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
			this.ball.speed += 0.5;
		}

		if (
			this.ball &&
			this.cpu &&
			this.ball.posX - this.ball.radius < 0
		) {
			this.cpu.score = `${Number(this.cpu.score) + 1}`;
			this.resetBall();
		} else if (
			this.user &&
			this.ball &&
			this.ball.posX + this.ball.radius > this.canvasGame.width
		) {
			this.user.score = `${Number(this.user.score) + 1}`;
			this.resetBall();
		}
	};

	resetBall() {
		this.ball = new Ball(
			this.canvasGame.width / 2,
			this.canvasGame.height / 2,
			3,
			3,
			this.ball && this.ball.velocityX > 0 ? -3 : 3,
			3,
			"white"
		);
	}

	// Dibujar todo
	render() {
		this.cleanScrean();
		if (this.ctx) {
			this.user?.drawPlayer(this.ctx);
			this.user?.drawScore(this.ctx, this.canvasGame);

			this.cpu?.drawPlayer(this.ctx);
			this.cpu?.drawScore(this.ctx, this.canvasGame);

			this.ball?.drawBall(this.ctx);
		}
	}

	game() {
		this.update();
		this.render();
		if (
			Number(this.user?.score) >= this.MaxPoints ||
			Number(this.cpu?.score) >= this.MaxPoints
		) {
			this.stopGame();
		}
		console.log("GameRuning");
	}

	startGame() {
		this.stopGame();
		const framePerSecond = 60;
		if (this.sendResultButton) this.sendResultButton.disabled = true;
		this.intervalId = window.setInterval(
			() => this.game(),
			1000 / framePerSecond
		);
	}

	stopGame() {
		if (this.intervalId !== null) {
			clearInterval(this.intervalId);
			this.intervalId = null;
			if (this.sendResultButton) {
				this.sendResultButton.disabled = false;
				this.sendResultButton.addEventListener("click", () => {
					this.registerMatch();
				});
			}
		}
	}

	async registerMatch() {
		try {
			if (this.user && this.cpu) {
				const res = await apiFetch({
					url: "matches/",
					headers: {
						authorization: `Bearer ${localStorage.getItem(
							"authToken"
						)}`,
						"Content-Type": "application/json",
					},
					method: FetchMethods.POST,
					body: {
						player1Id: this.user.playerName,
						player2Id: this.cpu.playerName,
						score1: `${this.user.score}`,
						score2: `${this.cpu.score}`,
						limitScore: `${this.MaxPoints}`,
						limitTime: "180",
						matchTime: "60",
					},
				});
			}
		} catch (error) {
			console.error(error);
		}
	}
}
