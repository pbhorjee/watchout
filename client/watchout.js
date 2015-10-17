//CONSTANTS
var ENEMY_RADIUS = 12;
var PLAYER_RADIUS = 12;
var FLOOR_WIDTH = 1000;
var FLOOR_HEIGHT = 500;

// GLOBALS
var collided = false;
var score;
var highScore;
var collisionCount;
var players = [];
var numEnemies = 20;
var enemies;
var animInterval;
var scoreInterval;
var $numEnemies = $('#form #num-enemies');

function constructEnemies(numEnemies) {
  var enemies = [];
  for (var i = 0; i < numEnemies; i++) {
    var randX = Math.floor(Math.random() * FLOOR_WIDTH);
    var randY = Math.floor(Math.random() * FLOOR_HEIGHT);

    enemies.push(new Entity(randX, randY, ENEMY_RADIUS));
  };
  return enemies;
}

function constrain(num, horizontal) {
  if (num < 0) {
    return 0;
  }
  if (horizontal && num > FLOOR_WIDTH) {
    return FLOOR_WIDTH;
  }
  else if (!horizontal && num > FLOOR_HEIGHT) {
    return FLOOR_HEIGHT;
  }
  return num;
}

function updateScores() {
  d3.select("#current-score").text(score);
  d3.select("#high-score").text(highScore);
  flash($('#current-score'), 'unflash');

  d3.select("#num-collisions").text(collisionCount);
  flash($('#num-collisions'), 'unflash');
}

function flash($elem, unFlashClass) {
  $elem.removeClass(unFlashClass);
  $elem.addClass('flash');

  setTimeout(
    function() { 
      $elem.addClass(unFlashClass)
      $elem.removeClass('flash');
     },
    500);
}

function createField() {
  clearInterval(animInterval);
  clearInterval(scoreInterval);
  score = 0;
  highScore = 0; 
  collisionCount = 0;
  updateScores();
  enemies = constructEnemies(numEnemies);
  d3.selectAll(".player").data([]).exit().remove();
  players[0] = new Entity(FLOOR_WIDTH / 2, FLOOR_HEIGHT / 2, PLAYER_RADIUS);
  d3.selectAll(".enemy").data([]).exit().remove();
  $("div.playing-field").empty();
  var svg = d3.select("div.playing-field")
    .append("svg")      
      .attr("width", FLOOR_WIDTH)
      .attr("height", FLOOR_HEIGHT);

  var drag = d3.behavior.drag()  
      .on('drag', function() {
        var xPos = constrain(d3.event.x, true), yPos = constrain(d3.event.y, false); 
        players[0].setX(xPos);
        players[0].setY(yPos);
        playerDot.attr('cx', xPos)
                 .attr('cy', yPos);
     });

  var playerDot = svg.selectAll(".player")
      .data(players)
      .enter()
      .append("circle")
        .attr("cx", function(p) { return p.getX(); })
        .attr("cy", function(p) { return p.getY(); })
        .attr("r", function(p) { return p.getR(); })
        .attr("class", "player")
      .call(drag);

  var enemeyDots = svg.selectAll(".enemy")
      .data(enemies)
      .enter()
      .append("circle")
        .attr("cx", function(e) { return e.getX(); })
        .attr("cy", function(e) { return e.getY(); })
        .attr("r", function(p) { return p.getR(); })
        .attr("class", "enemy");

  //set up recurring game functions
  animInterval = setInterval(function() {
    for (var i = 0; i < enemies.length; i++) {
      enemies[i].randomLocation();
    }

    var enemyElements = d3.selectAll(".enemy").data(enemies)
           .transition().attr("cx", function(e) { return e.getX(); })
           .attr("cy", function(e) { return e.getY(); }).duration(1400).tween('custom', tweenWithCollisionDetection);
  }, 1500);

  scoreInterval = setInterval(function() {
    score++;
    d3.select("#current-score").text(score);
  }, 50);

}

//COLLISION DETECTION
var tweenWithCollisionDetection = function(endEnemy) {
  var enemy = d3.select(this), startX = parseFloat(enemy.attr('cx')), startY = parseFloat(enemy.attr('cy'));
  return function(t) {
    checkCollision(enemy, onCollision);
    return enemy.attr('cx', startX + (endEnemy.getX() - startX) * t).attr('cy', startY + (endEnemy.getY() - startY) * t);
  };
};

var onCollision = function() {
  if (!collided) {
    collided = true;
    collisionCount++;
    if (highScore < score) {
      highScore = score;
      flash($('#high-score'), 'unflash');
    }
    score = 0;
    updateScores();

    $('.playing-field').addClass('shake-horizontal');
    setTimeout(function() { 
      $('.playing-field').removeClass('shake-horizontal') 
    }, 125);
    setTimeout(function() {
      collided = false;
    }, 200);
  }
}

function checkCollision(enemy, collidedCallback) {
  var radiusSum, separation, xDiff, yDiff;

  radiusSum = parseFloat(enemy.attr('r')) + players[0].getR();
  xDiff = parseFloat(enemy.attr('cx')) - players[0].getX();
  yDiff = parseFloat(enemy.attr('cy')) - players[0].getY();
  separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

  if (separation < radiusSum) { 
    return collidedCallback(players[0], enemy);
  }
}

//  FORM
$numEnemies.val(numEnemies);

$('#form').bind('keypress', function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    flash($(':input'), 'unflash');
    numEnemies = $numEnemies.val();
    $numEnemies.blur();

    createField();
  
    return false;
  }

  if (e.keyCode < 48 || e.keyCode > 57) {
    e.preventDefault();
  }
});

createField();
