// Создание поля

const para = document.querySelector('p');
let count = 0;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// Функция генерирующая рандомную цифру

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

// Функция генерирующая рандомный цвет

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

// Прототип функции мяча, точки пропадания шаров и функции их отрисовки

function Shape(x, y, velX, velY) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
}

function Ball(x, y, velX, velY, color, size) {
    Shape.call(this, x, y, velX, velY);

    this.exists = true;
    this.color = color;
    this.size = size;
}

function EvilCircle(x, y, velX, velY, color, size) {
    Shape.call(this, x, y, 20, 20);

    this.color = 'white';
    this.size = 10;

    window.addEventListener('keydown', (e) => {
        switch(e.key) {
          case 'a':
            this.x -= this.velX;
            break;
          case 'd':
            this.x += this.velX;
            break;
          case 'w':
            this.y -= this.velY;
            break;
          case 's':
            this.y += this.velY;
            break;
        }
      });
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

Ball.prototype.update = function () {
    start();
    window.addEventListener('resize', start);
    width = window.innerWidth;
    height = window.innerHeight;
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
}

EvilCircle.prototype.checkBounds = function () {

    if ((this.x + this.size) >= width) {
        this.x = this.size;
    }

    if ((this.x - this.size) <= 0) {
        this.x = this.size;
    }

    if ((this.y + this.size) >= height) {
        this.y = this.size;
    }

    if ((this.y - this.size) <= 0) {
        this.y = this.size;
    }
}

// Определение столкновения шаров друг с другом

Ball.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
}

EvilCircle.prototype.collisionDetect = function () {
    for (const ball of balls) {
        if (ball.exists) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + ball.size) {
                ball.exists = false;
                count--;
                para.textContent = 'Осталось шаров: ' + count;
            }
        }
    }
}

// Создание массива шаров и их анимация

const balls = [];

while (balls.length < 25) {
    var ball = new Ball(
        random(0, width),
        random(0, height),
        random(-7, 7),
        random(-7, 7),
        'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
        random(10, 20)
    );
    balls.push(ball);
    count++;
    para.textContent = 'Осталось шаров: ' + count;
}

var evilCircle = new EvilCircle(random(0, width), random(0, height));

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
        if (ball.exists) {
            ball.draw();
            ball.update();
            ball.collisionDetect();
        }
    }

    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();

    requestAnimationFrame(loop);
}

function start() {
    document.getElementById('SpanID1').innerText = document.documentElement.clientWidth;
    document.getElementById('SpanID2').innerText = document.documentElement.clientHeight;
}

loop();