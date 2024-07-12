lconst canvas = document.getElementById("interactive-game"); //"links to canavas using the id"
const ctx = canvas.getContext("2d");

let x = 100; // Start location on x-axis
let y = 100; // Start location on y-axis
let speed = 0.85; // Speed of player

//Load different sprites
let spriteIdle = new Image();
spriteIdle.src = "images/spriteidle.png"
let spriteRun = new Image();
spriteRun.src = "images/spriterun.png"

//starting sprite
let currentSprite = spriteIdle;
let startTime = 0;
let elapsedTime = 0;
let highScore = 0;

//Movement key variables
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

//player info variables
let playerWidth = 80; // Desired width of the player image
let playerHeight = 100; // Desired height of the player image

//frames info for spritesheet
let frameIndex = 0;
let frameCount = 2; // Number of frames in the sprite sheet
let frameSpeed = 100; // speed of frame change (higher = slower)
let frameInterval = 0;

let frameWidth = 275;  // Example width of each frame
let frameHeight = 380; // Example height of each frame
let currentFrame = 0; // Example: initialize current frame index

let bullets = []; // Array to hold bullets
let bulletInterval = 0; // Interval to control bullet creation

let gameOver = false;


let player = { //identify player info
  x: x,
  y: y,
  height: playerHeight,
  width: playerWidth,
  lives: 3, //defines how many lives the player has before game over
  update: function() {
    if (this.lives <=0) {
      gameOver = true;
      elapsedTime = Date.now() - startTime; //calculate elapse time when game over
      if (elapsedTime > highScore) {
        highScore = elapsedTime;
      }
    }
  }

}

spriteIdle.onload = function() { //loads player image when loading game
  drawGame();
};




function drawGame() {
  if (!gameOver) { 
      requestAnimationFrame(drawGame);
  } else {
      ctx.fillStyle = "red";
      ctx.font = "30px Arial";
      ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
      ctx.fillText("High Score: " + (highScore / 1000).toFixed(2) + "s", canvas.width / 2 - 120, canvas.height / 2 + 50);
      // Display Play Again button
      ctx.fillStyle = "white";
      ctx.fillRect(canvas.width / 2 - 60, canvas.height / 2 + 100, 120, 40);
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";
      ctx.fillText("Play Again", canvas.width / 2 - 60, canvas.height / 2 + 128);
      return; // Exit function to stop drawing
  }


  clearScreen();
  inputs();
  boundaryCheck();
  drawPlayer();
  runBullets(); // Run bullets within the draw loop
  player.update();
  drawLives();
  drawTimer();
}


function clearScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function boundaryCheck() { //makes sure player does not "leave" the canvas
  // Up
  if (player.y < 0) {
    player.y = 0;
  }
  // Down
  if (player.y > canvas.height - playerHeight) {
    player.y = canvas.height - playerHeight;
  }
  // Left
  if (player.x < 0) {
    player.x = 0;
  }
  // Right
  if (player.x > canvas.width - playerWidth) {
    player.x = canvas.width - playerWidth;
  }
}

function inputs() {
  if (!startTime){
    if (upPressed || downPressed || leftPressed || rightPressed){
      startTime = Date.now();
    }
  }
  
  if (upPressed) {
    player.y -= speed;
  }
  if (downPressed) {
    player.y += speed;
  }
  if (leftPressed) {
    player.x -= speed;
  }
  if (rightPressed) {
    player.x += speed;
  }
}

function drawPlayer() {
  // Clear the previous frame if needed
  ctx.clearRect(player.x, player.y, playerWidth, playerHeight);

  // Draw the current frame of the sprite sheet
  ctx.drawImage(
    currentSprite,            // Image object containing the sprite sheet
    currentFrame * frameWidth, // X coordinate of the frame in the sprite sheet
    0,                       // Y coordinate of the frame in the sprite sheet (assuming it's at the top)
    frameWidth,              // Width of the frame
    frameHeight,             // Height of the frame
    player.x,                // X coordinate on the canvas to draw
    player.y,                // Y coordinate on the canvas to draw
    playerWidth,             // Width to draw on the canvas
    playerHeight             // Height to draw on the canvas
  );

  // Increment frame index for next draw call (to animate)
  frameInterval++;
  if (frameInterval >= frameSpeed) {
    currentFrame = (currentFrame + 1) % frameCount;
    frameInterval = 0; // Reset frame interval counter
  }
}


document.body.addEventListener("keydown", keyDown);
document.body.addEventListener("keyup", keyUp);

function keyDown(event) {
  // W (Up)
  if (event.key === 'w') {
    upPressed = true;
    currentSprite = spriteRun;
  }

  // S (Down)
  if (event.key === 's') {
    downPressed = true;
    currentSprite = spriteRun;
  }
  // A (Left)
  if (event.key === 'a') {
    leftPressed = true;
    currentSprite = spriteRun;
  }

  // D (Right)
  if (event.key === 'd') {
    rightPressed = true;
    currentSprite = spriteRun;
  }
}

function keyUp(event) {
  // W (Up)
  if (event.key === 'w') {
    upPressed = false;
    currentSprite = spriteIdle;
  }

  // S (Down)
  if (event.key === 's') {
    downPressed = false;
    currentSprite = spriteIdle;
  }
  // A (Left)
  if (event.key === 'a') {
    leftPressed = false;
    currentSprite = spriteIdle;
  }

  // D (Right)
  if (event.key === 'd') {
    rightPressed = false;
    currentSprite = spriteIdle;
  }
}

// Handle Play Again button click
canvas.addEventListener("click", function(event) {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;


  // Check if click is inside the Play Again button area
  if (clickX >= canvas.width / 2 - 60 && clickX <= canvas.width / 2 + 60 &&
      clickY >= canvas.height / 2 + 100 && clickY <= canvas.height / 2 + 140) {
      resetGame(); // Call resetGame function
  }
});


function resetGame() {
  // Reset all game variables
  player.x = 100;
  player.y = 100;
  player.lives = 3;
  player.hits = 0;
  bullets = [];
  bulletInterval = 0;
  gameOver = false;
  startTime = 0;
  elapsedTime = 0;
  frameSpeed = 50;
  frameInterval = 0;


  // Restart the game loop
  requestAnimationFrame(drawGame);
}

// Function to draw remaining lives
function drawLives() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Lives: " + player.lives, 10, 60)
}



// Bullets
class Bullet {
  constructor(x, y, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 10;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

function runBullets() {
  if (startTime > 0) {
    bulletInterval++;
    if (bulletInterval % 260 === 0) { //Changes amount of bullets that appears (higher number = less bullets)
      let y1 = Math.floor(Math.random() * (canvas.height - 0)) + 0;
      let y2 = Math.floor(Math.random() * (canvas.height - 0)) + 0;
      let x1 = Math.floor(Math.random() * (canvas.width - 0)) + 0;
      let x2 = Math.floor(Math.random() * (canvas.width - 0)) + 0;
      bullets.push(new Bullet(-10, y1, 1, 0));
      bullets.push(new Bullet(canvas.width, y2, -1, 0));
      bullets.push(new Bullet(x1, -10, 0, 1));
      bullets.push(new Bullet(x2, canvas.height, 0, -1));
  }
}

  for (let i = 0; i < bullets.length; i++) {
    bullets[i].update();
    bullets[i].draw();
    if (bullets[i].x < -11 || bullets[i].x > 880 || bullets[i].y < -11 || bullets[i].y > 550) {
        bullets.splice(i, 1);
        i--; // Adjust index after splice
    } else if (collision(player, bullets[i])) {
        player.lives--;
        player.hits++;
        bullets.splice(i, 1);
        i--; // Adjust index after splice
        if (player.hits >= 5) {
            gameOver = true;
        }
    }
}
}


// Collision
function collision(first, second) {
  if (first.x < second.x + second.width &&
      first.x + first.width > second.x &&
      first.y < second.y + second.height &&
      first.y + first.height > second.y) {
      return true;
      }
}

// Function to draw elapsed time
function drawTimer() {
  if (startTime > 0 && !gameOver) {
      let currentTime = Date.now();
      elapsedTime = currentTime - startTime;
  }
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Time: " + (elapsedTime / 1000).toFixed(2) + "s", 10, 30);
}

function runGame() {
  ctx.clearRect(0, 0, 880, 550);
  drawPlayer();
  if (!gameOver) {
      requestAnimationFrame(runGame);
  }
}
requestAnimationFrame(runGame);