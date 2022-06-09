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