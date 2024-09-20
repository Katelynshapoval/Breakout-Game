import Paddle from "./paddle.js";
import Ball from "./Ball.js";

// Initialize paddle and ball
const paddleEl = document.getElementById("paddle");
const paddle = new Paddle(paddleEl);
const ball = new Ball(document.getElementById("ball"));

// Restart button
let restartButton = document.getElementById("restart");

// Score
let scoreEl = document.getElementById("scoreNumber");
let score = 0;

//blocks
let blockArray = [];
let blockWidth = calculateBlockWidth();
let blockHeight = 30;
let blockColumns = 6;
let blockRows = 3; //add more as game goes on
let blockMaxRows = 10; //limit how many rows
let blockCount = 0;

function calculateBlockWidth() {
  return window.innerWidth / 6 - 6 * 3;
}

//board
let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

//starting block corners top left
let blockX = 29;
let blockY = 55;

let lastTime;

window.onload = function () {
  board = document.getElementById("blocks");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on the board

  requestAnimationFrame(update);

  //create blocks
  createBlocks();
  console.log(blockArray);
};

function update(time) {
  if (lastTime != null) {
    const delta = time - lastTime;
    let blockHit = ball.update(delta, paddle.rect(), blockArray);
    // If lost
    if (ball.velocity == 0) {
      restartButton.focus();
      restartButton.style.display = "block";
    }
    if (blockHit) {
      console.log(blockHit);
      blockArray[blockHit].break = true;
      score++;
      console.log(blockArray[blockHit]);
    }
    //blocks
    context.fillStyle = "#63072a";
    context.clearRect(0, 0, board.width, board.height);
    for (let i = 0; i < blockArray.length; i++) {
      let block = blockArray[i];
      if (!block.break && i !== blockHit) {
        context.fillRect(block.x, block.y, block.width, block.height);
      } else {
        blockArray.splice(i, 1);
      }
    }
  }
  scoreEl.textContent = score;
  lastTime = time;
  window.requestAnimationFrame(update);
}

document.addEventListener("keydown", (event) => {
  const key = event.key;
  const viewportWidthPx = window.innerWidth;
  // Convert paddle.position from vw to pixels
  const paddlePosition = (paddle.position / 100) * viewportWidthPx;
  switch (key) {
    case "ArrowLeft":
      // Calculate the new position in pixels if moving left
      const newPositionPxLeft = paddlePosition - paddle.step;

      // Check if the paddle's new left edge is within the viewport width
      if (newPositionPxLeft - paddle.width / 2 >= 0) {
        // Update paddle position in vw units
        paddle.position = (newPositionPxLeft / viewportWidthPx) * 100;
      }
      break;

    case "ArrowRight":
      // Calculate the new position in pixels if moving right
      const newPositionPxRight = paddlePosition + paddle.step;

      // Check if the paddle's right edge is within the viewport width
      if (newPositionPxRight + paddle.width / 2 <= viewportWidthPx) {
        // Update paddle position in vw units
        paddle.position = (newPositionPxRight / viewportWidthPx) * 100;
      }
      break;
  }
});

function createBlocks() {
  blockArray = []; //clear blockArray
  for (let c = 0; c < blockColumns; c++) {
    for (let r = 0; r < blockRows; r++) {
      let block = {
        x: blockX + c * blockWidth + c * 10, //c*10 space 10 pixels apart columns
        y: blockY + r * blockHeight + r * 10, //r*10 space 10 pixels apart rows
        width: blockWidth,
        height: blockHeight,
        break: false,
      };
      blockArray.push(block);
    }
  }
  blockCount = blockArray.length;
}

restartButton.addEventListener("click", () => {
  restartButton.style.display = "none";
  ball.reset();
  paddle.reset();
  score = 0;
  createBlocks();
});
