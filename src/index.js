const gameArea = document.getElementById("game");
const plr = document.createElement("div");
const btun = document.getElementById("btn");
const scare = document.getElementById("score");

class Obstacle {
  constructor(w, h, x, y) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y;
  }
}

let obstacles = [];
const obstacleColor = "red";
const maxObstacles = 10;
let obstacleSpeed = 5;
const obstacleDelay = 2;
let obstacleObjects = [];
const frames = 10;
let scl = 0;
let minS = 10;
let maxS = 10;
let gameOver = false;
let score = 0;
let player = {
  x: 100,
  y: 100,
  w: 50,
  h: 50,
  vx: 0,
  vy: 0,
  f: 0.9,
  s: 5
};

function gameLoop() {
  updatePlayer();
  Obstacles();
  updateScore();
  if (gameOver === true) {
    btun.style.visibility = "visible";
    return true;
  }
  setTimeout(gameLoop, frames);
}
function Obstacles() {
  updateObject();
  if (obstacles.length < maxObstacles) {
    createObstacleVars();
  }
}
function createObstacleVars() {
  //create the obstacle vars and record the object
  const scale = Math.floor(Math.random()) + minS;
  obstacles[obstacles.length] = new Obstacle(
    scale,
    scale,
    window.innerWidth,
    Math.random() * window.innerHeight
  );
  scl = scale;
  createObstacle(
    scl,
    scl,
    obstacles[obstacles.length - 1].x,
    obstacles[obstacles.length - 1].y
  );
}
function createObstacle(w, h, x, y) {
  const object = document.createElement("div");
  object.style.height = h + "px";
  object.style.width = w + "px";
  object.style.left = x + "px";
  object.style.bottom = y + "px";
  object.style.backgroundColor = obstacleColor;
  object.style.position = "absolute";
  object.id = "object" + obstacleObjects.length;
  obstacleObjects[obstacleObjects.length] = object;
  gameArea.appendChild(object);
}
function updateObject() {
  for (let i = 0; i < obstacles.length - 1; i++) {
    //Check if ther is an object to update
    if (obstacles[i] !== null) {
      //Update obstacles positions
      obstacleObjects[i].style.left = obstacles[i].x + "px";
      obstacleObjects[i].style.bottom = obstacles[i].y + "px";
      //Move the positions
      obstacles[i].x -= obstacleSpeed;
      //collision
      if (
        player.x < obstacles[i].x + obstacles[i].w &&
        player.x + player.w > obstacles[i].x &&
        player.y < obstacles[i].y + obstacles[i].h &&
        player.h + player.y > obstacles[i].y
      ) {
        gameOver = true;
      }
      //Check if out of bounds
      if (obstacles[i].x < -obstacles[i].w - 50 /* Give some offset */) {
        obstacles.splice(i);
        obstacleObjects[i].remove();
        obstacleObjects.splice(i);
        createObstacleVars();
      }
    }
  }
}
function drawPlayer() {
  plr.id = "player";
  plr.style.width = player.w + "px";
  plr.style.height = player.h + "px";
  gameArea.appendChild(plr);
}
function updatePlayer() {
  player.x += player.vx;
  player.y += player.vy;
  player.vx = player.vx * player.f;
  player.vy = player.vy * player.f;
  plr.style.left = player.x + "px";
  plr.style.bottom = player.y + "px";
  //Collision
  if (player.y > window.innerHeight - player.h) {
    player.y = window.innerHeight - player.h;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.x > window.innerWidth - player.w) {
    player.x = window.innerWidth - player.w;
  }
  if (player.x < 0) {
    player.x = 0;
  }
}
function updateScore() {
  score += frames / 1000;
  obstacleSpeed += 0.001;
  scare.innerText = "Score: " + Math.floor(score);
}
function startGame() {
  obstacles = [];
  obstacleObjects = [];
  scl = 0;
  minS = 40;
  maxS = 40;
  gameOver = false;
  score = 0;
  obstacleSpeed = 5;
  player = {
    x: 100,
    y: 50,
    w: 20,
    h: 20,
    vx: 0,
    vy: 0,
    f: 0.9,
    s: 5
  };
  //delete all child elements
  var child = gameArea.lastElementChild;
  while (child) {
    gameArea.removeChild(child);
    child = gameArea.lastElementChild;
  }
  drawPlayer();
  gameLoop();
}
document.onkeydown = function (k) {
  if (k.keyCode === 87) {
    player.vy = player.s;
  }
  if (k.keyCode === 65) {
    player.vx = -player.s;
  }
  if (k.keyCode === 83) {
    player.vy = -player.s;
  }
  if (k.keyCode === 68) {
    player.vx = player.s;
  }
};
btun.onclick = function () {
  startGame();
  btun.style.visibility = "hidden";
};
