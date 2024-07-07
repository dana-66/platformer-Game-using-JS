const startBtn = document.getElementById("start-btn");
const canvas = document.getElementById("canvas");
const startScreen = document.querySelector(".start-screen");
const checkpointScreen = document.querySelector(".checkpoint-screen");
const checkpointMessage = document.querySelector(".checkpoint-screen > p");


// The Canvas API can be used to create graphics in games using JavaScript and the HTML canvas element.
// Adding 2-D graphics
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;//The innerWidth property is a number that represents the interior width of the browser window.
canvas.height = innerHeight;
const gravity = 0.5;
let isCheckpointCollisionDetectionActive = true;

const proportionalSize = (size) => {
    // to make the size responsive and visually consistent
    return innerHeight < 500 ? Math.ceil((size / 500) * innerHeight) : size;
};

// main player
class Player {
    constructor() {
        this.position = {
            x: proportionalSize(10),
            y: proportionalSize(400)
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = proportionalSize(40);
        this.height = proportionalSize(40);
    }

    // method responsible for creating the players width, height, position and fill color
    draw() {
        ctx.fillStyle = "#99c9ff";
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    };

    // for updating the player's position and velocity as it moves throughout the game.
    update() {
        this.draw();
        this.position.x += this.velocity.x; //player moves to the right
        this.position.y += this.velocity.y; // player jumps
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            if (this.position.y < 0) {
                this.position.y = 0;
                this.velocity.y = gravity;
            } else {
                this.velocity.y = 0;
            }
            this.velocity.y += gravity;
        }
        if (this.position.x < this.width) {
            this.position.x = this.width;
        }
        // if the player's x position has exceeded the right edge of the canvas
        if (this.position.x >= canvas.width - 2 * this.width) {
            this.position.x = canvas.width - 2 * this.width;
        }

    };
};

const player = new Player();

const animate = () => {
    // The requestAnimationFrame() web API, takes in a callback and is used to update the animation on the screen. 
    requestAnimationFrame(animate);
    // As the player moves through the game, you will need to clear the canvas before rendering the next frame of the animation.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.update();
    if (keys.rightKey.pressed && player.position.x < proportionalSize(400)) {
        player.velocity.x = 5;
    } else if (keys.leftKey.pressed && player.position.x > proportionalSize(100)) {
        player.velocity.x = -5;
    }else {
        player.velocity.x = 0;
    }
}

const keys = {
    rightKey: {
        pressed: false
    },
    leftKey: {
        pressed: false
    }
};

// for moving the player across the screen
const movePlayer = (key, xVelocity, isPressed) => {
    if (!isCheckpointCollisionDetectionActive) {
        player.velocity.x = 0;
        player.velocity.y = 0;
        return;
    }
    switch (key) {
        case "ArrowLeft":
            keys.leftKey.pressed = isPressed;
            if (xVelocity === 0) {
                player.velocity.x = xVelocity;
            }
            player.velocity.x -= xVelocity;
            break;

        case "ArrowUp":
        case " ":
        case "Spacebar": 
            player.velocity.y -= 8; break;

        case "ArrowRight":
            keys.rightKey.pressed = isPressed;
            if (xVelocity === 0) {
                player.velocity.x = xVelocity;
            }
            player.velocity.x += xVelocity;
            break;

    };
};

const startGame = () => {
    canvas.style.display = "block";
    startScreen.style.display = "none";
    animate();
};

startBtn.addEventListener("click", startGame);

window.addEventListener("keydown", ({ key }) => {
    movePlayer(key,8,true);
});
window.addEventListener("keyup", ({ key }) => {
    movePlayer(key,0,false);

});

// creating the platform