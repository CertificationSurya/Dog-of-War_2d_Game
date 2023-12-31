import { Dust, Fire, Splash } from "./particles.js";

const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6
}


class State {
    // state in constructor holds args of what the dog is doing. E.g: sitting, running and so on.
    constructor(state, game) {
        this.state = state;
        this.game = game;
    }

    createDivingParticles() {
        for (let i = 0; i < 20; i++) {
            this.game.particles.unshift(new Splash(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5,))
        }
    }
}


export class Sitting extends State {
    constructor(game) {
        super('SITTING', game)
    }

    // will run once when this state is entered
    enter() {
        this.game.player.frameX = 0
        this.game.player.maxFrame = 4
        this.game.player.frameY = 5

    }

    // takes key input and checks if current key is pressed for switching to other state
    handleInput(input) {
        if (input.includes('ArrowLeft')
            || input.includes('ArrowRight')
            || input.includes('swipe left')
            || input.includes('swipe right')) {
            // fixed choppy state change
            if (input.length > 1) input.length = 1;

            this.game.player.setState(states.RUNNING, 1.5);
        }
        else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2)
        }
    }
}


export class Running extends State {
    constructor(game) {
        super('RUNNING', game)
    }

    // will run once when this state is entered
    enter() {
        this.game.player.frameX = 0
        this.game.player.maxFrame = 8
        this.game.player.frameY = 3

    }

    // takes key input and checks if current key is pressed for switching to other state
    handleInput(input) {
        this.game.particles.unshift(new Dust(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height))

        if (input.includes('swipe left')){
            this.game.player.speed -= this.game.player.maxSpeed;
        }
        else if (input.includes('swipe right')){
            this.game.player.speed += this.game.player.maxSpeed;
        }

        if (input.includes('ArrowDown')
        || input.includes('swipe down')
        ) {
            if ( !(input.includes('swipe left') || input.includes('swipe right'))){
                if (input.length > 1) input.length = 1;
                this.game.player.setState(states.SITTING, 0);
            }
        }
        else if (input.includes('ArrowUp') 
        || input.includes('swipe up')
        ) {
            this.game.player.setState(states.JUMPING, 1.5);
        }

        else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2)
        }
    }
}


export class Jumping extends State {
    constructor(game) {
        super('JUMPING', game)
    }

    // will run once when this state is entered
    enter() {
        if (this.game.player.onGround()) this.game.player.vy -= 25
        this.game.player.frameX = 0
        this.game.player.maxFrame = 6
        this.game.player.frameY = 1
    }

    // takes key input and checks if current key is pressed for switching to other state
    handleInput(input) {
        // vy goes from -ve val to +ve val whereas weight remains same (1)
        if (this.game.player.vy > this.game.player.weight) {
            this.game.player.setState(states.FALLING, 1.5);
        }

        else if (input.includes('Enter')) {
            this.game.player.setState(states.ROLLING, 2)
        }
        else if (input.includes('ArrowDown') ) {
            this.game.player.setState(states.DIVING, 0)
        }
    }
}

export class Falling extends State {
    constructor(game) {
        super('FALLING', game)
    }

    // will run once when this state is entered
    enter() {
        this.game.player.frameX = 0
        this.game.player.maxFrame = 6
        this.game.player.frameY = 2
    }

    // takes key input and checks if current key is pressed for switching to other state
    handleInput(input) {
        if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1.5);
        }
        else if (input.includes('ArrowDown') || input.includes('swipe down')) {
            this.game.player.setState(states.DIVING, 0)
        }
    }
}


export class Rolling extends State {
    constructor(game) {
        super("ROLLING", game)
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6
        this.game.player.frameY = 6
    }

    handleInput(input) {

        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5))

        if (input.includes('swipe left') ){
            this.game.player.speed -= this.game.player.maxSpeed;
        }
        else if (input.includes('swipe right')){
            this.game.player.speed += this.game.player.maxSpeed;
        }

        if (!input.includes('Enter') && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1.5)
        }
        else if (!input.includes('Enter') && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1.5)
        }
        else if (input.includes('Enter') && (input.includes('ArrowUp') || input.includes('swipe up')) && this.game.player.onGround()) {
            // this.game.player.setState(states.JUMPING, 1.5)
            this.game.player.vy -= 25
        }
        else if ((input.includes('ArrowDown') || input.includes('swipe down')) && !this.game.player.onGround() && this.game.player.vy > -5) {
            this.game.player.setState(states.DIVING, 1.5)
        }

    }
}


export class Diving extends State {
    constructor(game) {
        super("DIVING", game)
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 6;
        this.game.player.frameY = 6;
        this.game.player.vy = 15
    }

    handleInput(input) {

        this.game.particles.unshift(new Fire(this.game, this.game.player.x + this.game.player.width * 0.5, this.game.player.y + this.game.player.height * 0.5))

        // fixed diving glitch
        if (input.includes('Enter') && this.game.player.onGround()) {
            this.game.player.setState(states.ROLLING, 1.5)
            super.createDivingParticles()

        }
        else if (this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1.5)
            super.createDivingParticles()
        }

    }
}


export class Hit extends State {
    constructor(game) {
        super("HIT", game)
    }
    enter() {
        this.game.player.frameX = 0;
        this.game.player.maxFrame = 10;
        this.game.player.frameY = 4;
    }

    handleInput(input) {

        if (this.game.player.frameX >= 10 && this.game.player.onGround()) {
            this.game.player.setState(states.RUNNING, 1.5)
        }
        else if (this.game.player.frameX >= 10 && !this.game.player.onGround()) {
            this.game.player.setState(states.FALLING, 1.5)
        }


    }
}

