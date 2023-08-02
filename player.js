import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from "./playerState.js";
import { CollisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from "./floatingMessages.js";

export class Player {
    // js class object are referencial meaning a copy ain't made but is refered
    constructor(game) {
        this.game = game
        this.width = 100;
        this.x = 0

        this.height = 91.3;
        this.y = this.game.height - this.height - this.game.groundMargin
        this.vy = 0; // velocity - y-axis
        this.weight = 1;

        this.image = document.getElementById("player")

        this.speed = 0;
        this.maxSpeed = 10

        // sprite frames
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;

        this.fps = 20
        this.frameInterval = 1000 / this.fps; // this means onEvery 50 milisecond the frame changes. however, the movement doesn't gets affected
        this.frameTimer = 0; // next frame trigger w.r.t deltaTime and frameInterval.

        // helper property
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)]

        this.collisions = []

        this.currentState = null

    }

    // moving around and cycle sprite
    update(input, deltaTime) {
        this.checkCollision()

        this.currentState.handleInput(input)

        // horizontal
        this.x += this.speed

        if (input.includes('ArrowRight') && this.currentState !== this.states[6]) this.speed = this.maxSpeed
        else if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0

        if (this.x < 0) this.x = 0
        if (this.x > this.game.width - this.width) this.x = this.game.width - this.width

        // vertical movement
        this.y += this.vy
        if (!this.onGround()) this.vy += this.weight
        else this.vy = 0

        // vertical boundaries
        if (this.y > this.game.height - this.height - this.game.groundMargin) {
            this.y = this.game.height - this.height - this.game.groundMargin
        }

        // sprite animation
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0
        }
        else {
            this.frameTimer += deltaTime
        }



    }

    draw(context) {
        // image, 4args to crop, 4 args to paste
        // image,sourceImg-x,sourceImg-y,sourceImg-width,sourceImg-height, x-where, y-where, width, height,
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height)

        // .strokeRect() -> draws a rectangle that is stroked (outlined) according to the current strokeStyle and other context settings
        { this.game.debug && context.strokeRect(this.x, this.y, this.width, this.height) }
    }

    // utility methods
    onGround() {
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    setState(state, speed) {
        this.currentState = this.states[state];
        this.currentState.enter()
        this.game.speed = this.game.maxSpeed * speed
    }

    checkCollision() {
        this.game.enemies.forEach(enemy => {
            // collision| hitbox
            if (
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))

                // if rolling or diving
                if (this.currentState === this.states[4] || this.currentState === this.states[5]){
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage("+1", enemy.x , enemy.y, 75 , 30));
                }
                else {
                    // play hit and stop the frame
                    this.setState(6, 0)
                    this.game.lives --;
                    if (this.game.lives === 0) this.game.gameOver = true
                }

            }
        })
    }

}