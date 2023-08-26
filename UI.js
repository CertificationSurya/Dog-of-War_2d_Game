export class UI{
    constructor(game){
        this.game = game;
        this.fontSize = 20;
        this.fontFamily = "Creepster";
        this.livesImage = document.getElementById('lives')
    }

    draw(context){
        context.save()
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = "#999";
        context.shadowBlur = 0;

        context.font = `${this.fontSize}px ${this.fontFamily}`
        context.textAlign = "left"
        context.fillStyle = this.game.fontColor;
       
        // score
        context.fillText(`Score: ${this.game.score}`,20, 25)

        // timer
        context.font = `${this.fontSize * 0.8}px ${this.fontFamily}`
        context.fillText(`Total Time: ${this.game.maxTime /( 1000)} sec`, 20, 50)
        context.fillText(`Time: ${(this.game.time * 0.001).toFixed(1)} sec`, 20, 70)

        // lives
        for (let i= 0; i< this.game.lives; i++){
            context.drawImage(this.livesImage, 25 * i*1.05 + 20, 80, 25, 25)
        }


        // game over message
        if (this.game.gameOver){
            context.textAlign = 'center';
            context.font = `${this.fontSize * 2}px ${this.fontFamily}`
            if (this.game.score > this.game.winningScore){
                context.fillText(`Winner winner, Booyah?👍`, this.game.width * 0.5, this.game.height * 0.5 -100)
            }
            else{
                context.fillText(`Hahhh, Noob 😶‍🌫️`, this.game.width * 0.5, this.game.height * 0.5 -100)
            }
            // restart Message
            context.fillStyle = "#36454F"
            context.fillText(`Wanna Play Again?`, this.game.width * 0.5, this.game.height * 0.5)
            context.fillText(`👉 press "r" or "double Tap" On the screen.`, this.game.width * 0.5, this.game.height * 0.5 + 50)
        }

        context.restore();
    }
}