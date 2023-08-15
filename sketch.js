var trex_running;
var trex;
var trex_collided;
var ground;
var groundImage;
var invisibleGround;
var cloud;
var cloudImage;
var obstacle;
var obstacle1;
var obstacle2;
var obstacle3;
var obstacle4;
var obstacle5;
var obstacle6;
var score = 0;
var obstacleGroup;
var cloudGroup;
var play = 1;
var end = 0;
var gameState = play;
var gameOver;
var gameOverImg;
var restart;
var restartImg;
var jumpSound;
var dieSound;
var checkpointSound;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle_1.png");
  obstacle2 = loadImage("obstacle_2.png");
  obstacle3 = loadImage("obstacle_3.png");
  obstacle4 = loadImage("obstacle_4.png");
  obstacle5 = loadImage("obstacle_5.png");
  obstacle6 = loadImage("obstacle_6.png");
  trex_collided = loadImage("trex_collide.png");
  gameOverImg = loadImage("game_over.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  trex = createSprite(300, 100, 50, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.35;
  trex.x = 50;
  edges = createEdgeSprites();
  ground = createSprite(300, 180, 600, 10);
  ground.addImage(groundImage);
  ground.x = ground.width / 2;
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;
  obstacleGroup = new Group();
  cloudGroup = new Group();
  trex.setCollider("rectangle", 0, 0, 20, trex.height);
  // trex.debug = true;
  gameOver = createSprite(300, 100, 100, 30);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.4;
  restart = createSprite(300, 140);
  restart.addImage(restartImg);
  restart.scale = 0.3
}

function draw() {
  background(rgb(230, 230, 230));
  trex.collide(invisibleGround);
  console.log(trex.y)
  text("Score: " + score, 525, 25);
  if (gameState == play) {
    gameOver.visible = false;
    restart.visible = false;
    ground.velocityX = -(5 + score / 300);
    score = score + 1;
    if (keyDown("space") && trex.y >= 150) {
      trex.velocityY = -10;
      jumpSound.play();
    }
    if (score > 0 && score % 100 == 0) {
      checkpointSound.play();
    }
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }
    trex.velocityY = trex.velocityY + 0.5;
    trex.collide(edges[3]);
    spawnClouds();
    spawnObstacles();
    if (obstacleGroup.isTouching(trex)) {
      gameState = end;
      dieSound.play();
    }
  }
  else if (gameState == end) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    trex.changeAnimation("collided", trex_collided);
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
  }

  if (mousePressedOver(restart)) {
    console.log("Restart the Game");
    reset();
  }
  drawSprites();
}

function spawnClouds() {
  if (frameCount % 60 == 0) {
    cloud = createSprite(600, 100, 40, 10);
    cloud.addImage(cloudImage)
    cloud.velocityX = -(5 + score / 300);
    cloud.lifetime = 150;
    cloud.scale = 0.15;
    cloud.y = random(20, 110);
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudGroup.add(cloud);
  }
}

function spawnObstacles() {
  if (frameCount % 60 == 0) {
    FC = Math.round(random(55, 65))
    obstacle = createSprite(600, 165, 10, 40);
    obstacle.velocityX = -(5 + score / 300);
    obstacle.scale = 0.1
    obstacle.lifetime = 300;
    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default: break;
    }
    obstacleGroup.add(obstacle);
  }
}

function reset() {
  gameState = play;
  gameOver.visible = false;
  restart.visible = false;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
}