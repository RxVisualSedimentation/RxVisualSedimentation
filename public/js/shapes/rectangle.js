"use strict";

/**
 * Rectangle
 * @param position - vector of the bottom left corner position.
 * @param width - the width of the rectangle.
 * @param height - the height of the rectangle.
 * @param velocity - the speed that the rectangle is travelling at.
 * @param restitution - the bounciness of the rectangle.
 * @param mass - the rectangle of the circle.
 * @constructor
 */
function Rectangle(position, width, height, velocity, restitution, mass) {
  this.drawn = false;
  this.id = nextBodyId();
  this.position = position;
  this.width = width;
  this.height = height;
  this.inv_mass = mass !== 0 ? 1/mass : 0;
  this.velocity = velocity;
  this.restitution = restitution;
}

/**
 * Update the velocity of the rectangle by applying gravity.
 * @param gravity - the gravity vector.
 */
Rectangle.prototype.applyGravity = function (gravity) {
  if(this.inv_mass!==0){
    this.velocity = Vector.add(this.velocity, gravity);
  }
};

/**
 * Update the position of the rectangle.
 * @param dt - the change in time.
 */
Rectangle.prototype.updatePosition = function (dt) {
  var distanceVector = Vector.multiply(this.velocity, dt);
  this.position = Vector.add(this.position, distanceVector);
};

/**
 * Renders the SVG element of the rectangle.
 */
Rectangle.prototype.renderSVG = function () {
  if (!this.drawn)
    this.createSVG();
  else
    this.updateSVG();
};

/**
 * Creates an SVG element for the rectangle.
 */
Rectangle.prototype.createSVG = function () {
  svg.append("rect")
    .attr("x", this.position.x-this.width/2)
    .attr("y", this.position.y-this.height/2)
    .attr("width", this.width)
    .attr("height", this.height)
    .attr("id", "rectangle" + this.id)
    .attr("class", "rectangle");
  this.drawn = true;
};

/**
 * Updates an existing SVG element for the rectangle.
 */
Rectangle.prototype.updateSVG = function () {
  svg
    .select("#rectangle" + this.id)
    .attr("x", this.position.x-this.width/2)
    .attr("y", this.position.y-this.height/2);
};