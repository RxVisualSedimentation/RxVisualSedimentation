/*
 * Collision
 */
function Collision(a, b, penetration, normal) {
    "use strict";
    this.a = a;
    this.b = b;
    this.penetration = penetration;
    this.normal = normal;
    this.circleVsCircle = function(){
        var r = a.radius + b.radius;
        var n = b.position.minus(a.position);
        var nSquared = Math.pow(n.x, 2)+Math.pow(n.y, 2);
        if(nSquared > Math.pow(r, 2)){
            return false;
        }
        var d = n.length();
        if(d !== 0){
            this.penetration = r - d;
            this.normal = n.divide(d);
        } else {
            this.penetration = a.radius;
            this.normal = new Vector(1,0);
        }
        return true;
    };
}

/*
 * Vector
 */
function Vector(x, y) {
    "use strict";
    this.x = x;
    this.y = y;
    this.length = function(){
        return Math.sqrt(this.x*this.x+this.y*this.y);
    };
    this.minus = function(v2){
        return new Vector(this.x-v2.x,this.y-v2.y);
    };
    this.multiply = function(i){
        return new Vector(this.x*i,this.y*i);
    };
    this.divide = function(i){
        return new Vector(this.x/i,this.y/i);
    };
    this.dotProduct = function(v2){
        return this.x*v2.x+this.y*v2.y;
    }
}