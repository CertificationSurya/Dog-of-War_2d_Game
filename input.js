export class InputHandler {
    constructor(game) {
        this.game = game;

        // hold keys that are pressed down.
        this.keys = []
        this.touchY;
        this.touchX;
        // min scroll length for triggering event
        this.touchTresholdY = 30;
        this.touchTresholdX = 40;

        window.addEventListener('keydown', e => {
            if ((e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "Enter")
                && this.keys.indexOf(e.key) === -1) {

                // new key stay on first
                this.keys.unshift(e.key);
            }
            else if (e.key === "d") {
                this.game.debug = !this.game.debug;
            }
        })

        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === "ArrowLeft" ||
                e.key === "ArrowRight" ||
                e.key === "Enter") {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        })

        // For Mobiles
        let tapCount = 0;
        let timeout;

        window.addEventListener('touchstart', e => {
            this.touchY = e.changedTouches[0].pageY
            this.touchX = e.changedTouches[0].pageX

            tapCount++;
            if (tapCount == 2) {
                this.keys.unshift('Enter');
            }
        })

        window.addEventListener('touchmove', e => {
            const swipeDistanceY = e.changedTouches[0].pageY - this.touchY;
            const swipeDistanceX = e.changedTouches[0].pageX - this.touchX;

            // console.log(this.keys)

            if (swipeDistanceY < -this.touchTresholdY && this.keys.indexOf('swipe up') === -1) {
                this.keys = this.keys.filter(key => key != 'swipe down')
                this.keys.unshift('swipe up')
            }
            else if (swipeDistanceY > this.touchTresholdY && this.keys.indexOf('swipe down') === -1) {
                this.keys = this.keys.filter(key => key != 'swipe up')
                this.keys.unshift('swipe down')
                // console.log(this.keys)

            }
            else if (swipeDistanceX > this.touchTresholdX && this.keys.indexOf('swipe right') === -1) {
                this.keys = this.keys.filter(key => key !== 'swipe left')
                this.keys.unshift('swipe right')
            }
            else if (swipeDistanceX < -this.touchTresholdX && this.keys.indexOf('swipe left') === -1) {
                this.keys = this.keys.filter(key => key !== 'swipe right')
                this.keys.unshift('swipe left')
            }

            // console.log(this.keys)
        })

        window.addEventListener('touchend', e => {
            this.keys = []
            // this.keys = this.keys.filter(key => key !== 'Enter')

            setTimeout(() => {
                tapCount = 0;
            }, 300)
        })

    }


}