"use strict";

/**
 * Vector
 * @param x - The x-coordinate
 * @param y - The y-coordinate
 * @constructor
 */
function Vector(x, y) {
  this.x = x;
  this.y = y;
  this.length = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };
}

/**
 * Adds two vectors and returns the result.
 * @param v1 - The first vector
 * @param v2 - The second vector
 * @returns - A new vector
 */
Vector.add = function (v1, v2) {
  return new Vector(v1.x + v2.x, v1.y + v2.y);
}

/**
 * Subtracts a vector from another vector and returns the result.
 * @param v1 - The first vector
 * @param v2 - The second vector
 * @returns - A new vector
 */
Vector.subtract = function (v1, v2) {
  return new Vector(v1.x - v2.x, v1.y - v2.y);
}

/**
 * Multiplies two vectors and returns the result.
 * @param v1 - The first vector
 * @param v2 - The second vector
 * @returns - A new vector
 */
Vector.multiply = function (v, factor) {
  return new Vector(v.x * factor, v.y * factor);
}

/**
 * Divides two vectors and returns the result.
 * @param v1 - The first vector
 * @param v2 - The second vector
 * @returns - A new vector
 */
Vector.divide = function (v, factor) {
  return new Vector(v.x / factor, v.y / factor);
}

/**
 * Calculates the dot product of two vectors.
 * @param v1 - The first vector
 * @param v2 - The second vector
 * @returns - The dot product
 */
Vector.dotProduct = function (v1, v2) {
  return v1.x * v2.x + v1.y * v2.y;
}

/**
 * Checks whether two vectors are equal.
 * @param v2 - The second vector
 * @returns - whether two vectors are equal.
 */
Vector.prototype.equals = function (v) {
  return this.x == v.x && this.y == v.y;
}