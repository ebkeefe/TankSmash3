//the healths of the tanks
var health1 = 1000;
var health2 = 1000;

//the lives of the tanks
var lives1 = startingLife;
var lives2 = startingLife;

//the damages of the tanks. These will update when the lightning power up is obtained.
var damage1 = 1;
var damage2 = 1;



function drawTank(theta, health,tankNum){

    
    
    //drawing the health bar
    stack.push();
    stack.multiply(scalem(2.7, 0.5, 0.2));
    stack.multiply(scalem(health/1000, 1, 1));
    var red = 1 - health/1000;
    var green = 1 - red;
    gl.uniform4fv(uColor, vec4(red, green, 0.0, 1.0)); 
    gl.uniform1i(uMode, 4);
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();

    if (!tankTexture.ready){
        return;
    }
    stack.multiply(rotateY(-90));
    stack.multiply(translate(0,-6,0));
    
    stack.push();
    stack.multiply(scalem(1,1,.5));
    stack.multiply(translate(0,0,8));
    drawWheels(theta,tankNum);
    stack.pop();
    
    stack.push();
    stack.multiply(scalem(1,1,.5));
    stack.multiply(translate(0,0,-8));
    drawWheels(theta,tankNum);
    stack.pop();
    gl.uniform1i(uMode, 2);
    activateTexture(gl,tankTexture);
    
    if (damage1>1&&tankNum==1|| damage2>1 && tankNum == 2){
        activateTexture(gl,tankTextureDamage);
    }
    
    stack.push();
    stack.multiply(translate(0,.7,0));
    stack.multiply(scalem(7,1.85,3));
    stack.multiply(rotateX(90));
    gl.uniformMatrix4fv(uModel_view, false, flatten(flatten(stack.top()))); // set view transform
    gl.uniform4fv(uColor, vec4(0.0, 0.0, 0.0, 1.0));  // set color to black
    drawShape(Shapes.cylinder, false);
    stack.pop();
    
    /*
     stack.push();
     stack.multiply(translate(0,3,0));
     stack.multiply(scalem(5.5,.8,5));
     gl.uniformMatrix4fv(uModel_view, false, flatten(flatten(stack.top()))); // set view transform
     gl.uniform4fv(uColor, vec4(0.0, 0.0, 0.0, 1.0));  // set color to black
     drawShape(Shapes.cube, false);
     stack.pop();
     */
    stack.push();
    stack.multiply(translate(0,2,0));
    stack.multiply(rotateX(90));
    stack.multiply(scalem(5.5,4.95,2));
    gl.uniformMatrix4fv(uModel_view, false, flatten(flatten(stack.top()))); // set view transform
    gl.uniform4fv(uColor, vec4(0.0, 0.0, 0.0, 1.0));  // set color to black
    drawShape(Shapes.hexathing, false);
    stack.pop();
    
    stack.push();
    stack.multiply(translate(-2,3,0));
    stack.multiply(scalem(5,1.2,5));
    stack.multiply(rotateX(90));
    gl.uniformMatrix4fv(uModel_view, false, flatten(flatten(stack.top()))); // set view transform
    gl.uniform4fv(uColor, vec4(0.0, 0.0, 0.0, 1.0));  // set color to black
    drawShape(Shapes.cylinder, false);
    stack.pop();
    
    stack.push();
    stack.multiply(translate(0,4.2,0));
    //stack.multiply(rotateX(90));
    stack.multiply(scalem(3,1.7,3));
    gl.uniformMatrix4fv(uModel_view, false, flatten(flatten(stack.top()))); // set view transform
    gl.uniform4fv(uColor, vec4(0.0, 0.0, 0.0, 1.0));  // set color to black
    drawShape(Shapes.cylinder, false);
    stack.pop();
    
    stack.push();
    stack.multiply(translate(0,4.5,0));
    stack.multiply(rotateZ(90));
    stack.multiply(translate(0,3,0));
    stack.multiply(scalem(.5,5.5,.5));
    gl.uniformMatrix4fv(uModel_view, false, flatten(flatten(stack.top()))); // set view transform
    gl.uniform4fv(uColor, vec4(0.0, 0.0, 0.0, 1.0));  // set color to black
    drawShape(Shapes.cylinder, false);
    stack.pop();

    
}

//need to know a center of the tank and a radius of the tank
