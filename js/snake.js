const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
let score = 0;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = "right";

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = "#61dafb";
  snake.forEach(segment => {
    ctx.fillRect(segment.x * boxSize, segment.y * boxSize, boxSize, boxSize);
  });

  // Draw food
  ctx.fillStyle = "#ff6347";
  ctx.fillRect(food.x * boxSize, food.y * boxSize, boxSize, boxSize);

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

function move() {
  const head = { ...snake[0] };

  switch (direction) {
    case "up":
      head.y -= 1;
      break;
    case "down":
      head.y += 1;
      break;
    case "left":
      head.x -= 1;
      break;
    case "right":
      head.x += 1;
      break;
  }

  snake.unshift(head);

  // Check for collision with food
  if (head.x === food.x && head.y === food.y) {
    score++;
    spawnFood();
  } else {
    // If no collision with food, remove the last segment of the snake
    snake.pop();
  }

  // Check for collision with walls or itself
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width / boxSize ||
    head.y >= canvas.height / boxSize ||
    checkCollision()
  ) {
    resetGame();
  }
}

function checkCollision() {
  // Check if the head collides with any other segment of the snake
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  return false;
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * (canvas.width / boxSize)),
    y: Math.floor(Math.random() * (canvas.height / boxSize)),
  };

  // Make sure the food doesn't spawn on the snake
  while (checkCollisionWithSnake(food)) {
    food = {
      x: Math.floor(Math.random() * (canvas.width / boxSize)),
      y: Math.floor(Math.random() * (canvas.height / boxSize)),
    };
  }
}

function checkCollisionWithSnake(position) {
  return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

function resetGame() {
  alert("Game Over! Your score is " + score);
  snake = [{ x: 10, y: 10 }];
  direction = "right";
  score = 0;
  spawnFood();
}

function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowUp":
      direction = "up";
      break;
    case "ArrowDown":
      direction = "down";
      break;
    case "ArrowLeft":
      direction = "left";
      break;
    case "ArrowRight":
      direction = "right";
      break;
  }
}

function gameLoop() {
  draw();
  move();
  setTimeout(gameLoop, 100);
}

// Initialize the game
spawnFood();
gameLoop();

// Event listener for arrow key presses
document.addEventListener("keydown", handleKeyPress);
