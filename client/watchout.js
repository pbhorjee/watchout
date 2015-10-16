// start slingin' some d3 here.
//d3.selectAll("body").data()


var Enemy = function(x, y) {
  this.x = x;
  this.y = y;
}

Enemy.prototype.getX = function() {
  return this.x;
}

Enemy.prototype.getY = function() {
  return this.y;
}

Enemy.prototype.randomLocation = function() {
  this.x = Math.floor(Math.random() * floorWidth);
  this.y = Math.floor(Math.random() * floorHeight);
}

function constructEnemies(numEnemies) {
  var enemies = [];

  for (var i = 0; i < numEnemies; i++) {
    var randX = Math.floor(Math.random() * floorWidth);
    var randY = Math.floor(Math.random() * floorHeight);

    enemies.push(new this.Enemy(randX, randY));
  };

  return enemies;
}


constructEnemies();


var floorWidth = 1000;
var floorHeight = 500;
var enemies = constructEnemies(5);



var svg = d3.select("div.playing-field").append("svg")
      .attr("width", floorWidth)
      .attr("height", floorHeight);

var circles = svg.selectAll("circle")
    .data(enemies)
    .enter()
    .append("circle")
      .attr("cx", function(e) { return e.getX(); })
      .attr("cy", function(e) { return e.getY(); })
      .attr("r", 12)
      .attr("class", "enemy");
      

setInterval(function() {
  for (var i = 0; i < enemies.length; i++) {
    enemies[i].randomLocation();
  }
  var enemyElements = d3.selectAll(".enemy").data(enemies)
         .transition().attr("cx", function(e) { return e.getX(); })
         .attr("cy", function(e) { return e.getY(); }).duration(700);
         //.transition().attr("cx", 200).duration(2000);
}, 1500);
