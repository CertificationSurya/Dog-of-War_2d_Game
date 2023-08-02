export class FloatingMessage {
    constructor(value, x,y, targetX, targetY){
        this.value = value
        this.x = x
        this.y = y
        this.targetX = targetX
        this.targetY = targetY
        this.markedForDeletion = false 
        this.timer = 0
    }

    update(){
        // the * 0.03 states for each animation frame increase vertical & horizontal position by 3% of the difference between target position and current position
        // Meaning the lesser the gap betn target and current position, the slower the value moves
        this.x += (this.targetX - this.x ) *  0.03
        this.y += (this.targetY - this.y ) *  0.03 
        this.timer ++;
        if (this.timer > 100) this.markedForDeletion = true
    }

    draw(context){
        context.font = '18px Creepster'
        context.fillStyle = '#ced'
        context.fillText(this.value, this.x, this.y)

    }

}