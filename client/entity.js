var Entity = function(x, y, r) {
  this._x = x;
  this._y = y;
  this._r = r;
}

Entity.prototype.getX = function() {
  return this._x;
}

Entity.prototype.getY = function() {
  return this._y;
}

Entity.prototype.setX = function(x) {
  this._x = x;
}

Entity.prototype.setY = function(y) {
  this._y = y;
}

Entity.prototype.getR = function() {
  return this._r;
}

Entity.prototype.randomLocation = function() {
  this._x = Math.floor(Math.random() * FLOOR_WIDTH);
  this._y = Math.floor(Math.random() * FLOOR_HEIGHT);
}