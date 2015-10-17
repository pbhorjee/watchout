// OBJECTS

  // ENEMIES!

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


  // PLAYER

var Player = function() {
  this.x = floorWidth / 2;
  this.y = floorHeight / 2;
  this.r = 12;
}

Player.prototype.getX = function() {
  return this.x;
}

Player.prototype.getY = function() {
  return this.y;
}



// SETUP 

  // GLOBALS
var colided = false;
var score = 0;
var floorWidth = 1000;
var floorHeight = 500;
var enemies = constructEnemies(20);
var players = [];


  // CONSTUCTS
constructEnemies();

players.push(new Player());


  // D3'S
var svg = d3.select("div.playing-field").append("svg")      
      .attr("width", floorWidth)
      .attr("height", floorHeight);

var drag = d3.behavior.drag()  
      .on('drag', function() {
        var xPos = d3.event.x, yPos = d3.event.y; 
        if (xPos < 0) {
          xPos = 0
        } else if (xPos > 1000) {
          xPos = 1000;
        }
        if (yPos < 0) {
          yPos = 0;
        } else if (yPos > floorHeight) {
          yPos = floorHeight;
        }
        playerDot.attr('cx', xPos)
                 .attr('cy', yPos);
     });

var playerDot = svg.selectAll(".player")
    .data(players)
    .enter()
    .append("circle")
      .attr("cx", function(p) { return p.getX(); })
      .attr("cy", function(p) { return p.getY(); })
      .attr("r", 12)
      .attr("class", "player")
    .call(drag);

var enemeyDots = svg.selectAll(".enemy")
    .data(enemies)
    .enter()
    .append("circle")
      .attr("cx", function(e) { return e.getX(); })
      .attr("cy", function(e) { return e.getY(); })
      .attr("r", 12)
      .attr("class", "enemy");



// TIMELAPSE

setInterval(function() {
  colided = false;

  for (var i = 0; i < enemies.length; i++) {
    enemies[i].randomLocation();
  }

  var enemyElements = d3.selectAll(".enemy").data(enemies)
         .transition().attr("cx", function(e) { return e.getX(); })
         .attr("cy", function(e) { return e.getY(); }).duration(1400).tween('custom', tweenWithCollisionDetection);

  colided = false;
}, 1500);

setInterval(function() {
  score++;
  d3.select("#current-score").text(score);
}, 50);



// EVENTS 

tweenWithCollisionDetection = function(endData) {
  var endPos, enemy, startPos;

  enemy = d3.select(this);

  startPos = {
    x: parseFloat(enemy.attr('cx')),
    y: parseFloat(enemy.attr('cy'))
  };

  endPos = {
    x: endData.x,
    y: endData.y
  };

  return function(t) {
    var enemyNextPos;
    checkCollision(enemy, onCollision);
    enemyNextPos = {
      x: startPos.x + (endPos.x - startPos.x) * t,
      y: startPos.y + (endPos.y - startPos.y) * t
    };

    return enemy.attr('cx', enemyNextPos.x).attr('cy', enemyNextPos.y);
  };
};

var onCollision = function() {
  if (!colided) {
    $('.playing-field').addClass('shake-horizontal');

    var highScore = parseInt(d3.select("#high-score").text());
    var currentScore = parseInt(d3.select("#current-score").text());

    if (highScore < currentScore) {
      d3.select("#high-score").text(currentScore);
      flash('#high-score', 'unflash');
    }

    score = 0;
    d3.select("#current-score").text('0');
    flash('#current-score', 'unflash');

    var collisions = parseInt(d3.select("#num-collisions").text());
    collisions++;
    d3.select("#num-collisions").text(collisions);
    flash('#num-collisions', 'unflash');
    flash('.player', 'dotUnflash');  // player not flashing

    setTimeout(
      function() { $('.playing-field').removeClass('shake-horizontal') },
      125);
  }

  colided = true;
}

var flash = function(elem, unFlashClass) {
  $(elem).removeClass(unFlashClass);
  $(elem).addClass('flash');

  setTimeout(
    function() { 
      $(elem).addClass(unFlashClass)
      $(elem).removeClass('flash');
     },
    500);
}

var checkCollision = function(enemy, collidedCallback) {
    var radiusSum, separation, xDiff, yDiff;

    radiusSum = parseFloat(enemy.attr('r')) + players[0].r;
    xDiff = parseFloat(enemy.attr('cx')) - parseFloat(playerDot.attr('cx'));
    yDiff = parseFloat(enemy.attr('cy')) - parseFloat(playerDot.attr('cy'));
    separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

    if (separation < radiusSum) { 
      return collidedCallback(players[0], enemy);
    }
}
