let c, x = 150, y = 300, v = 0, gamespeed = 90;
const G = -9.81, RADIUS = 10, STARTX = 600;
let fps = 30, frameCounter, multiplier = 8, score;
let screentype;

//array of Obstacle objects that store values needed to rendere them on the canvas
let ObstacleArray = [];

//Obstacle class that carries information about individual obstacle
class Obstacle {
    constructor(y1, y2, width, offset) {
        this.y1 = y1;
        this.y2 = y2;
        this.width = width;
        this.height = c.height + 2;
        this.x = STARTX+offset;
        this.y = -1;
        this.passed = false;
    }

	//moves the x value
    progressMove(delta){
        this.x -= delta;
    }

	//sets position
    setPos(pos){
        this.x = pos;
    }

    //draws the 2 rectangle for obstacles
    drawit(){
        //draws top and bottom rectangles
        fill(255);
        rect(this.x, this.y, this.width, this.y1);
        rect(this.x, this.y2, this.width, this.height-this.y2);
    }
}

//initialization of the drawing
function setup(){
    c = createCanvas(600,600);
    c.id("canvas0");
    c.class("gamecanvas");
    background(100);
    frameRate(fps);
    stroke(0, 0);
    initObstacles();
    screentype = 0;
    score = 0;
    frameCounter = 0;
    textSize(40);
    textFont('Times New Roman');
}

//game loop
function draw() {
	if(screentype == 0){
		gameStart();
		return;
	}
    background(100);
    drawScore();
    drawObstacles();
    gameProgress();
    
}

//displays the start of the game screen
function gameStart(){
	background(100);
	push();
	fill(255);
	textFont('Arial');
	textSize(45);
	textAlign(CENTER, CENTER);
	text('Press Any Button to Start', 300, 300);
	pop();
	noLoop();
}

//function to modify all the logic values of the game
function gameProgress(){
    fill(0);
    ellipse(x, y, RADIUS*2, RADIUS*2);
    v += G/fps * multiplier;
    y -= v/fps * multiplier;
    
    for(var i = 0; i< ObstacleArray.length; i++){
        ObstacleArray[i].progressMove(gamespeed/fps);
    }

    checkCollision();
    checkInterval();
    increaseDifficulty();
}

//draws the current score at the top of the screen
function drawScore(){
    fill(255);
    text('Score: ' + score, 3, 35);
}

//analyses the collsions and stops the game if there is a collision of the main object
function checkCollision(){
    if(y >= 600 || y <= 0 || checkObstacles()){
        gameOver();
    }
}

//draws the game over screen and stops frames
function gameOver(){
    
    background(0);
    fill(255);
    push();
    textSize(64);
    textFont('Arial');
    textAlign(CENTER, CENTER);
    text('Game Over\nScore: '+score, 300,300);
    pop();
    
    screentype = 2;
    
	//frame stop
    noLoop();
}

//check interval to see if it needs to add/remove obstacle from the memory
function checkInterval(){
    if(ObstacleArray[ObstacleArray.length - 1].x <= STARTX){
        addObstacle();
    }

    if(ObstacleArray[0].x <= -ObstacleArray[0].width){
        ObstacleArray.shift();
    }

    for(var i = 0; i < ObstacleArray.length; i++){
        if(ObstacleArray[i].passed == false && ObstacleArray[i].x+ObstacleArray[i].width <= x-RADIUS){
            score++;
            ObstacleArray[i].passed = true;
        }
    }
    
}

function increaseDifficulty(){
    if(gamespeed >= 200) return;
    frameCounter++;

    if(frameCounter == 120){
        frameCounter = 0;
        gamespeed++;
        print(gamespeed);
    }
}

//functions that lead to the keypress
function mousePressed(){
	keyPressed();
}

function touchStarted(){
	keyPressed();
}

//on key press it either switches screens or adds velocity to the ball as a control method
function keyPressed(){
	if(screentype == 2){
		screentype = 0;
		gameStart();
		return;
	}

    //Reset game Values to starting
    if(screentype != 1){
        score = 0;
        x = 150, y = 300, v = 0;
        ObstacleArray = [];
        initObstacles();
        screentype = 1;
        frameCounter = 0;
        gamespeed = 90;
		loop();
		return;
    }

    v = 4.5 * multiplier;
}

//first 2 set obstacles
function initObstacles(){
    ObstacleArray.push(new Obstacle(150, 450, 25, 0));
    ObstacleArray.push(new Obstacle(150, 450, 25, 200));
}

//adds a random obstacle
function addObstacle(){
    var lowerlimit = 100;
    var upperlimit = 400;
    var gatesize = lowerlimit + Math.floor(Math.random() * (upperlimit-lowerlimit));
    var gateroof = 50 + (Math.floor(Math.random() * (c.height - lowerlimit - 50)));

    ObstacleArray.push(new Obstacle(gateroof, gateroof+gatesize, 25, 200));

}

//draws all the obstacles in the memory
function drawObstacles(){
    
    for(var i = 0; i < ObstacleArray.length; i++){
        ObstacleArray[i].drawit();
    }
} 

//checks if there is a collision with any obstacle
function checkObstacles(){
    for (var i = 0; i< ObstacleArray.length; i++){
        var getobj = ObstacleArray[i];

		//optimizes checks only for obstacles that are in the x range of the ball
        if((getobj.x <= x+RADIUS) && (getobj.x+getobj.width >= x-RADIUS) && obstacleCollide(x, y, getobj.x, getobj.y, getobj.y1, getobj.y2, getobj.width, getobj.height))
            return true;
    }
    return false;
}

//breaks down the rectangles of the obstacle to check it they collide
function obstacleCollide(xc, yc, xo, yo, y1, y2, width, height){
    //turn all starting points of the rectangles from top left
    var toprect = {
        x1: xo,
        y1: yo,
        x2: xo+width,
        y2: y1
    };

    var botrect = {
        x1: xo,
        y1: y2,
        x2: xo+width,
        y2: height
    }
    
    return (circleRectOverlap(RADIUS, xc, yc, toprect.x1, toprect.y1, toprect.x2, toprect.y2)
         || circleRectOverlap(RADIUS, xc, yc, botrect.x1, botrect.y1, botrect.x2, botrect.y2)); 
}


//Geeks For Geeks
//Source: https://www.geeksforgeeks.org/check-if-any-point-overlaps-the-given-circle-and-rectangle/
//very optimized code to determine if the circle shape and rectangle shape overlap
function circleRectOverlap(rad, xc, yc, x1, y1, x2, y2){
    var xn = Math.max(x1, Math.min(xc, x2));
    var yn = Math.max(y1, Math.min(yc, y2));

    var dist_x = xn - xc;
    var dist_y = yn - yc;
    return (dist_x * dist_x + dist_y * dist_y) <= rad * rad;
}