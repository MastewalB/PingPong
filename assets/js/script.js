const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const netWidth = 4;
const netHeight = canvas.height;

const paddleWidth = 10;
const paddleHeight = 90;

let upPressed = false;
let downPressed = false;

class Paddle {
    constructor(context, x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.context = context;
    }

    drawPaddle() {
        this.context.fillStyle = this.color;
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }


}

class Player {

    x = 0;
    y = 0;
}

const net = {
    x: canvas.width / 2 - netWidth / 2,
    y: 0,
    width: netWidth,
    height: netHeight,
    color: "#FFF"
};


const user = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FFF',
    score: 0
};


const computer = {
    x: canvas.width - (paddleWidth + 10),
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FFF',
    score: 0
};


const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: '#05EDFF'
}


//keyboard Listener
window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
    switch (event.keyCode) {
        case 38:
            upPressed = true;
            break;
        case 40:
            downPressed = true;
            break;
    }

}

function keyUpHandler(event) {
    switch (event.keyCode) {

        case 38:
            upPressed = false;
            break;

        case 40:
            downPressed = false;
            break;
    }
}



function reset() {
    // reset ball's value to older values
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;

    // changes the direction of ball
    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
}



function collisionDetect(player, ball) {
    player.top = player.y;
    player.right = player.x + player.width;
    player.bottom = player.y + player.height;
    player.left = player.x;

    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;

    return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}


function update() {
    // move the paddle

    if (localStorage.winTimes == null) {
        localStorage.setItem('winTimes', '0');
    }
    if (localStorage.loseTimes == null) {
        localStorage.setItem('loseTimes', '0');
    }

    if (upPressed && user.y > 0) {
        user.y -= 8;
    } else if (downPressed && (user.y < canvas.height - user.height)) {
        user.y += 8;
    }

    // check if ball hits top or bottom wall


    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        ball.velocityY = -ball.velocityY;
    }
    if (ball.x + ball.radius >= canvas.width) {
        user.score += 1;

        reset();
    }

    if (ball.x - ball.radius <= 0) {
        computer.score += 1;

        reset();
    }
    // move the ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // computer paddle movement
    computer.y += ((ball.y - (computer.y + computer.height / 2))) * 0.09;

    // collision detection on paddles

    let player = (ball.x < canvas.width / 2) ? user : computer;
    if (collisionDetect(player, ball)) {
        let angle = 0;

        if (ball.y < (player.y + player.height / 2)) {

            angle = -1 * Math.PI / 4;
        } else if (ball.y > (player.y + player.height / 2)) {

            angle = Math.PI / 4;
        }

        ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);


        ball.speed += 0.2;
    }

    if (computer.score > 10) {
        alert("You lose");
        user.score = 0;
        computer.score = 0;

        let loseTimes = localStorage.getItem('loseTimes');
        Number(loseTimes);
        loseTimes += 1;
        localStorage.setItem('loseTimes', loseTimes.toString());



    } else if (user.score > 10) {
        alert("You win");
        user.score = 0;
        computer.score = 0;

        let winTimes = localStorage.getItem('winTimes');
        Number(winTimes);
        winTimes += 1;
        localStorage.setItem('winTimes', winTimes.toString());


    }


}





function render() {

    let user_paddle = new Paddle(context, user.x, user.y, user.width, user.height, user.color);
    let computer_paddle = new Paddle(context, computer.x, computer.y, computer.width, computer.height, computer.color);

    context.fillStyle = "#200808";
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawNet();
    drawScore(canvas.width / 4, canvas.height / 6, user.score);
    drawScore(3 * canvas.width / 4, canvas.height / 6, computer.score);
    user_paddle.drawPaddle();
    computer_paddle.drawPaddle();
    drawBall(ball.x, ball.y, ball.radius, ball.color);

}

function drawNet() {
    context.fillStyle = net.color;
    context.fillRect(net.x, net.y, net.width, net.height);
}

function drawScore(x, y, score) {
    context.fillStyle = '#fff';
    context.font = '40px sans-serif';
    context.fillText(score, x, y);
}


function drawBall(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();

    context.arc(x, y, radius, 0, Math.PI * 2, true);
    context.closePath();
    context.fill();
}


function gameLoop() {
    update();
    render();
}

setInterval(gameLoop, 1000 / 60);








