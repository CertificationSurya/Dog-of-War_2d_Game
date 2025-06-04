/**  @type {HTMLCanvasElement} */

import {Player} from "./player.js";
import {InputHandler} from "./input.js";
import {Background} from "./background.js";
import {FlyingEnemy, ClimbingEnemy, GroundEnemy} from "./enemies.js";
import {UI} from "./UI.js";

window.addEventListener("load", () => {
	const canvas = document.getElementById("canvas1");
	const ctx = canvas.getContext("2d");
	canvas.width = 800;
	canvas.height = 500;

	const fullScreenBtn = document.getElementsByTagName("button")[0];
	// main logic
	class Game {
		constructor(width, height) {
			this.width = width;
			this.height = height;
			this.groundMargin = 80;
			this.speed = 0;
			this.maxSpeed = 3;

			this.player = new Player(this);
			this.input = new InputHandler(this);
			this.background = new Background(this);
			this.UI = new UI(this);

			this.enemyTimer = 0;
			this.enemyInterval = 1300;
			// holds all enemy
			this.enemies = [];

			this.debug = false;
			this.time = 0;
			this.maxTime = 6000 * 20;
			this.gameOver = false;

			this.score = 0;
			this.winningScore = 100;
			this.fontColor = "black";

			this.player.currentState = this.player.states[0];
			this.player.currentState.enter();

			this.particles = [];
			this.maxParticles = 50;

			this.collisions = [];
			this.lives = 3;
			this.floatingMessages = [];
		}

		// update method that'll run for all animation frame
		update(deltaTime) {
			this.time += deltaTime;
			if (this.time > this.maxTime) this.gameOver = true;

			// console.log(this.input.keys)

			this.background.update(this);
			this.player.update(this.input.keys, deltaTime);

			// handleEnemies
			if (this.enemyTimer > this.enemyInterval) {
				this.addEnemy();
				this.enemyTimer = 0;
			} else {
				this.enemyTimer += deltaTime;
			}

			this.enemies.forEach((enemy) => {
				enemy.update(deltaTime);
			});

			// handle particles
			this.particles.forEach((particle, index) => {
				particle.update();
			});

			if (this.particles.length > this.maxParticles) {
				// this.particles = this.particles.slice(0, this.maxParticles)
				// or simply
				this.particles.length = this.maxParticles;
			}

			// handles Collision sprites
			this.collisions.forEach((collision, index) => {
				//to slow down animation time, deltaTime
				collision.update(deltaTime);
			});

			// handle Floating Messages
			this.floatingMessages.forEach((message, index) => {
				message.update();
			});

			// deletion of marked elements

			this.collisions = this.collisions.filter(
				(collision) => !collision.markedForDeletion
			);
			this.particles = this.particles.filter(
				(particle) => !particle.markedForDeletion
			);
			this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
			this.floatingMessages = this.floatingMessages.filter(
				(message) => !message.markedForDeletion
			);
		}

		draw(context) {
			this.background.draw(context);

			this.particles.forEach((particle) => {
				particle.draw(context);
			});

			this.player.draw(context);

			this.enemies.forEach((enemy) => {
				enemy.draw(context);
			});

			this.collisions.forEach((collision) => {
				collision.draw(context);
			});

			this.UI.draw(context);

			this.floatingMessages.forEach((message) => {
				message.draw(context);
			});
		}

		addEnemy() {
			if (this.speed > 0 && Math.random() < 0.5) {
				this.enemies.push(new GroundEnemy(this));
			} else if (this.speed > 0) {
				this.enemies.push(new ClimbingEnemy(this));
			}

			this.enemies.push(new FlyingEnemy(this));
		}
	}

	// Full screen mode
	const fullScreen = () => {
		// .fullscreenElement gives null if not in full screen.
		if (!document.fullscreenElement) {
			canvas.requestFullscreen().catch((err) => {
				alert("couldn't open full Screen Mode ", err.message);
			});
		} else {
			document.exitFullscreen().catch((err) => {
				alert("Couldn't exit the full Screen Mode: ", err.message);
			});
		}
	};

	fullScreenBtn.addEventListener("click", (e) => {
		fullScreen();
	});

	let game = new Game(canvas.width, canvas.height);
	let lastTime = 0;

	function animate(timeStamp = 0) {
		// 'deltaTime' -> gives time interval of how long each frame stays on screen
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.update(deltaTime);
		game.draw(ctx);
		// requestAnimationFrame, automatically adjust screen refresh rate also auto generates the timestamp and auto passeses it to the function it calls, in this case animate
		{
			!game.gameOver && requestAnimationFrame(animate);
		}
	}
	animate();

	// for Reloading purpose
	window.addEventListener("keydown", (e) => {
		if (game.gameOver) {
			if (e.key === "r" || e.key === "R") {
				game.gameOver = !game.gameOver;
				game = new Game(canvas.width, canvas.height);
				animate();
			}
		}
	});

	// Reloading in mobile
	let tapCount = 0;
	window.addEventListener("touchstart", (e) => {
		if (game.gameOver) {
			tapCount++;
			if (tapCount == 2) {
				game.gameOver = !game.gameOver;
				game = new Game(canvas.width, canvas.height);
				animate();
			}
			const timeout = setTimeout(() => {
				tapCount = 0;
			}, 400);
		}
	});
});
