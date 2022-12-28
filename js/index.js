const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width    = 1024
canvas.height   = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.5
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

const shop = new Sprite({
    position: {
        x: 625,
        y: 128
    },
    scale: 2.75,
    framesMax: 6,
    imageSrc: './img/shop.png'
})

const player = new Fighter({
    
    position: {
        x: 300,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 153
    },
    sprites: {
        idle: {
            imageSrc: './img/samuraiMack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/samuraiMack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack: {
            imageSrc: './img/samuraiMack/Attack1.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 157,
        height: 50
    }
})

const enemy = new Fighter({
    
    position: {
        x: 700,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './img/kenji/idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 168
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        }
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
})

enemy.draw()

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    //sprites render
    background.update()
    shop.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    //Player movement

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else player.switchSprite('idle')

    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }
    //Enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
       enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
       enemy.switchSprite('run')
    } else enemy.switchSprite('idle')

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //detect for collision
    //player attack
    if( rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
    }) && 
        player.isAttacking && player.framesCurrent === 4
    ){
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }
    //if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    //enemy attack
    if( rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
    }) && 
        enemy.isAttacking && enemy.framesCurrent === 2
    ){
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }
    //if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    //end the game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        //player keys
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            if (player.velocity.y === 0)
                player.velocity.y = -15
            break
        case 's':
            player.attack() 
            break    
        //enemy keys    
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            if (enemy.velocity.y === 0)
            enemy.velocity.y = -15
            break
        case 'ArrowDown':
            enemy.attack()
            break           
    }
})
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        //player keys
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
        //enemy keys    
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break 

    }
})