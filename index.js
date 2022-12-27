const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width    = 1024
canvas.height   = 576

c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
    constructor(position) {
      this.position = position 
    }

    draw(){
        c.fillStyle = 'Red'
        c.fillRect(this.position.x, this.position.y, 50, 150)
    }
}

const player = new Sprite({
    x: 0,
    y: 0
})

player.draw()