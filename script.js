// Создание поля

const para = document.querySelector('p');
let count = 0;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var width = window.innerWidth;
var height = window.innerHeight;

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
    switch (e.key) {
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
      case 'ф':
        this.x -= this.velX;
        break;
      case 'в':
        this.x += this.velX;
        break;
      case 'ц':
        this.y -= this.velY;
        break;
      case 'ы':
        this.y += this.velY;
        break;
      case 'ArrowLeft':
        this.x -= this.velX;
        break;
      case 'ArrowRight':
        this.x += this.velX;
        break;
      case 'ArrowUp':
        this.y -= this.velY;
        break;
      case 'ArrowDown':
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
  if ((this.x + this.size) >= width && this.velX > 0) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height && this.velY > 0) {
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

function checkCollision() {
  for (var i = 0; i < balls.length; i++) {
    for (var j = i + 1; j < balls.length; j++) {
      var dx = balls[i].x - balls[j].x;
      var dy = balls[i].y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < balls[i].size + balls[j].size) {
        balls[j].color = balls[i].color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
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
    }
  }
  checkCollision();

  evilCircle.draw();
  evilCircle.checkBounds();
  evilCircle.collisionDetect();

  requestAnimationFrame(loop);
}

function resize() {
  var newWidth = window.innerWidth;
  var newHeight = window.innerHeight;

  if (newWidth < width || newHeight < height) {
    for (var i = 0; i < balls.length; i++) {
      if ((balls[i].y + balls[i].size) >= newHeight)
        balls[i].y = newHeight - balls[i].size;
      if ((balls[i].x + balls[i].size) >= newWidth)
        balls[i].x = newWidth - balls[i].size;
    }
  }

  width = canvas.width = newWidth;
  height = canvas.height = newHeight;
}

window.addEventListener('resize', resize);
resize();
loop();