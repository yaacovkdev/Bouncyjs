let c, x = 150, y = 300, v = 0, gamespeed = 90;
const G = -9.81, RADIUS = 10, STARTX = 600;
let fps = 30, multiplier = 8, score;
let screentype;

let ObstacleArray = [];

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

    progressMove(delta){
        this.x -= delta;
    }

    setPos(pos){
        this.x = pos;
    }

    

    //draw the rectangle
    drawit(){
        //draws top and bottom rectangles
        fill(255);
        rect(this.x, this.y, this.width, this.y1);
        rect(this.x, this.y2, this.width, this.height-this.y2);
    }
}

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
    textSize(40);
    textFont('Times New Roman');
	
}

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
}

function drawScore(){
   
    fill(255);
    text('Score: ' + score, 3, 35);
    
}

function checkCollision(){
    if(y >= 600 || y <= 0 || checkObstacles()){
        gameOver();
    }
}

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
    
    noLoop();
}

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

function mousePressed(){
	keyPressed();
}

function touchStarted(){
	keyPressed();
}

function keyPressed(){
	if(screentype == 2){
		screentype = 0;
		gameStart();
		return;
	}
    if(screentype != 1){
		
        score = 0;
        x = 150, y = 300, v = 0;
        ObstacleArray = [];
        initObstacles();
        screentype = 1;
		loop();
		return;
    }
    v = 4 * multiplier;
}


function initObstacles(){
    ObstacleArray.push(new Obstacle(150, 450, 25, 0));
    ObstacleArray.push(new Obstacle(150, 450, 25, 200));
}

function addObstacle(){
    var lowerlimit = 100;
    var upperlimit = 400;
    var gatesize = lowerlimit + Math.floor(Math.random() * (upperlimit-lowerlimit));
    var gateroof = 50 + Math.floor(Math.random() * c.height - lowerlimit - 50);

    ObstacleArray.push(new Obstacle(gateroof, gateroof+gatesize, 25, 200));

}

function drawObstacles(){
    
    for(var i = 0; i < ObstacleArray.length; i++){
        ObstacleArray[i].drawit();
    }
} 

function checkObstacles(){
    for (var i = 0; i< ObstacleArray.length; i++){
        var getobj = ObstacleArray[i];

        if((getobj.x <= x+RADIUS) && (getobj.x+getobj.width >= x-RADIUS) && obstacleCollide(x, y, getobj.x, getobj.y, getobj.y1, getobj.y2, getobj.width, getobj.height))
            return true;
    }
    return false;
}

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
function circleRectOverlap(rad, xc, yc, x1, y1, x2, y2){
    var xn = Math.max(x1, Math.min(xc, x2));
    var yn = Math.max(y1, Math.min(yc, y2));

    var dist_x = xn - xc;
    var dist_y = yn - yc;
    return (dist_x * dist_x + dist_y * dist_y) <= rad * rad;
}