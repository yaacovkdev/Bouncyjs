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