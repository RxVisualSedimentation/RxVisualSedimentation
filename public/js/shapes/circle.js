"use strict";

/**
 * Circle
 * @param position - vector of the position.
 * @param radius - the radius of the circle.
 * @param velocity - the speed that the circle is travelling at.
 * @param restitution - the bounciness of the circle.
 * @param mass - the mass of the circle.
 * @constructor
 */
function Circle(position, radius, velocity, restitution, mass, color) {
  this.drawn = false;
  this.id = nextBodyId();
  this.radius = radius;
  this.position = position;
  this.inv_mass = mass !==0 ? 1/mass : 0;
  this.velocity = velocity;
  this.restitution = restitution;
  this.color = color;
}

/**
 * Update the velocity of the circle by applying gravity.
 * @param gravity - the gravity vector.
 */
Circle.prototype.applyGravity = function (gravity) {
  this.velocity = Vector.add(this.velocity, gravity);
};

/**
 * Update the position of the circle.
 * @param dt - the change in time.
 */
Circle.prototype.updatePosition = function (dt) {
  var distanceVector = Vector.multiply(this.velocity, dt);
  this.position = Vector.add(this.position, distanceVector);
};

/**
 * Update the radius of the circle.
 * @param delta_radius - the change in radius.
 */
Circle.prototype.updateRadius = function (delta_radius) {
  this.radius += delta_radius;
  //this.inv_mass = this.radius !==0 ? 1/(this.radius*2) : 9001;
};

/**
 * Renders the SVG element of the circle.
 */
Circle.prototype.renderSVG = function () {
  if (!this.drawn)
    this.createSVG();
  else
    this.updateSVG();
}

/**
 * Creates an SVG element for the circle.
 */
Circle.prototype.createSVG = function () {
  svg.append("circle").attr("r", this.radius)
    .attr("cx", this.position.x)
    .attr("cy", this.position.y)
    .attr("id", "circle" + this.id)
    .attr("class", "ball")
    .style("fill", this.color);;
  this.drawn = true;
}

/**
 * Destroy an SVG element for the circle.
 */
Circle.prototype.destroySVG = function () {
  if(svg.select("#circle" + this.id)[0][0] !== null){
    svg.select("#circle" + this.id).remove();
  }
}

/**
 * Updates an existing SVG element for the circle.
 */
Circle.prototype.updateSVG = function () {
  svg.select("#circle" + this.id)
    .attr("r", this.radius)
    .attr("cx", this.position.x)
    .attr("cy", this.position.y);
}