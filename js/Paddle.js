export default class Paddle {
  // Constructor for initializing the Paddle instance
  constructor(paddleElem) {
    this.paddleElem = paddleElem; // The HTML element representing the paddle
    this.step = 10; // Step size for moving the paddle
    this.width = 200; // Width of the paddle
  }

  // Getter for the paddle's position
  get position() {
    // Retrieve the current position from CSS custom properties
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--position")
    );
  }

  // Setter for the paddle's position
  set position(value) {
    // Update the position in CSS custom properties
    this.paddleElem.style.setProperty("--position", value);
  }

  // Method to get the bounding rectangle of the paddle element
  rect() {
    return this.paddleElem.getBoundingClientRect();
  }

  // Method to reset the paddle's position
  reset() {
    this.position = 50; // Reset the paddle's position to the center (assuming 0-100 range)
  }
}
