// Initial velocity of the ball
const INITIAL_VELOCITY = 0.025;

// Rate at which the ball's velocity increases over time
const VELOCITY_INCREASE = 0;
// const VELOCITY_INCREASE = 0.00001;

export default class Ball {
  // Constructor for initializing the Ball instance
  constructor(ballElem) {
    this.ballElem = ballElem; // The HTML element representing the ball
    this.reset(); // Initialize the ball's position and direction
  }

  // Getter for the ball's x position
  get x() {
    // Retrieve the current x position from CSS custom properties
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }

  // Setter for the ball's x position
  set x(value) {
    // Update the x position in CSS custom properties
    this.ballElem.style.setProperty("--x", value);
  }

  // Getter for the ball's y position
  get y() {
    // Retrieve the current y position from CSS custom properties
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }

  // Setter for the ball's y position
  set y(value) {
    // Update the y position in CSS custom properties
    this.ballElem.style.setProperty("--y", value);
  }

  // Method to get the bounding rectangle of the ball element
  rect() {
    return this.ballElem.getBoundingClientRect();
  }

  // Method to reset the ball's position and direction
  reset() {
    this.x = 50; // Reset x position to the center of the container (assuming 0-100 range)
    this.y = 35; // Reset y position to the center of the container (assuming 0-100 range)

    // Initialize direction to ensure it is not too horizontal or too vertical
    this.direction = { x: 0 };
    while (
      Math.abs(this.direction.x) <= 0.2 || // Ensure the x direction is not too close to horizontal
      Math.abs(this.direction.x) >= 0.9 // Ensure the x direction is not too close to vertical
    ) {
      // Randomly generate a heading angle for the direction
      const heading = randomNumberBetween(0, 2 * Math.PI);
      // Set direction based on the cosine and sine of the heading angle
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }

    // Initialize velocity
    this.velocity = INITIAL_VELOCITY;
  }
  update(delta, paddleRect, blockArray) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    this.velocity += VELOCITY_INCREASE * delta;
    const rect = this.rect();

    // Bounce off the top and bottom edges of the screen
    if (rect.top <= 0) {
      this.direction.y *= -1;
    }
    // Dont bounce off the bottom edge
    if (rect.bottom >= window.innerHeight) {
      this.velocity = 0;
    }

    // Bounce off the left and right edges of the screen
    if (rect.right >= window.innerWidth || rect.left <= 0) {
      this.direction.x *= -1;
    }

    if (isCollision(paddleRect, rect)) {
      this.direction.y *= -1;
    }
    for (let i = 0; i < blockArray.length; i++) {
      if (isCollisionBlock(rect, blockArray[i])) {
        this.direction.y *= -1;
        return i;
      }
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}
function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}

function isCollisionBlock(ball, block) {
  let size = 30;
  return (
    ball.x < block.x + block.width && //a's top left corner doesn't reach b's top right corner
    ball.x + size > block.x && //a's top right corner passes b's top left corner
    ball.y < block.y + block.height && //a's top left corner doesn't reach b's bottom left corner
    ball.y + size > block.y
  ); //a's bottom left corner passes b's top left corner
}
