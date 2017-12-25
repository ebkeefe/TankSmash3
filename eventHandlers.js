/**
 *  Event handler methods. Stores the state of the mouse.
 * @type {type}
 */
startingLife = 3;
 paused = false;

var mouseState = {
    startx: 0,  // position at the start of a mouse move
    starty: 0,
    down: false,
    x: 0,    // current position of mouse during a mouse move
    y: 0,
    delx: 0, // difference between x and startx
    dely: 0,
    
    // The mouse button being pressed
    actionChoice: {TUMBLE: 0, // left mouse button
        DOLLY: 1, // middle mouse button
        TRACK: 2, // right mouse button
        NONE: 3
    },
    
/**
 * Reset parameters when mouse is released
 * @return {undefined}
 */
    reset: function () {
        this.startx = 0;
        this.starty = 0;
        this.down = false;
        this.x = 0;
        this.y = 0;
        this.delx = 0;
        this.dely = 0;
        this.action = this.actionChoice.NONE;
    },

/** 
 * Helper funtion to display mouse state
 * @return {String|message}
 */
    displayMouseState: function () {
        message = "<b>Mouse state: </b><br>&nbsp;startx=" + mouseState.startx +
                "<br>&nbsp;starty=" + mouseState.starty +
                "<br>&nbsp;x = " + mouseState.x + 
                "<br>&nbsp;y = " + mouseState.y +
                "<br>&nbsp;delx = " + mouseState.delx + 
                "<br>&nbsp;dely = " + mouseState.dely +
                "<br>&nbsp;button = " + mouseState.action +
                "<br>&nbsp;down = " + mouseState.down;
        return message;
    }
};
mouseState.action =  mouseState.actionChoice.NONE; // current mouse button

/**
 * Mouse event handlers
 * @return {undefined}
 */
function setMouseEventHandler() {
    return; 
    canvas = document.getElementById( "gl-canvas" );
    canvas.addEventListener("mousedown", function (e) {
        mouseState.startx = e.clientX;
        mouseState.starty = e.clientY;
        mouseState.x = e.clientX;
        mouseState.y = e.clientY;
        mouseState.delx = 0;
        mouseState.dely = 0;
        mouseState.down = true;
        mouseState.action = e.button;
        document.getElementById("mouseAction").innerHTML ="<b>Action:</b> Mouse Down <br>" ;
        document.getElementById("mouseState").innerHTML = mouseState.displayMouseState();
    });
    canvas.addEventListener("mouseup", function (e) {
       // console.log("mouse up");
        mouseState.reset();
        document.getElementById("mouseAction").innerHTML ="<b>Action:</b> resetting - Mouse Up <br>" ;
        document.getElementById("mouseState").innerHTML =  mouseState.displayMouseState();
        
    });
    canvas.addEventListener("mousewheel", function (e) {
        mouseState.action = mouseState.actionChoice.DOLLY;
        mouseState.x = e.clientX;
        mouseState.y = e.clientY;
        mouseState.delx = e.wheelDelta;
        mouseState.dely = e.wheelDelta;
        camera1.motion();
        document.getElementById("mouseAction").innerHTML ="<b>Action:</b> Mouse wheel <br>";
        document.getElementById("mouseState").innerHTML = mouseState.displayMouseState();
    });
    canvas.addEventListener("mousemove", function (e) {
        if (mouseState.down) {
            mouseState.x = e.clientX;
            mouseState.y = e.clientY;
            mouseState.delx = mouseState.x - mouseState.startx;
            mouseState.dely = mouseState.y - mouseState.starty;
            camera1.motion();
        }
        document.getElementById("mouseAction").innerHTML ="<b>Action:</b> Mouse Move <br>";
        document.getElementById("mouseState").innerHTML = mouseState.displayMouseState();
    });
}

/**
 * Key press event handlers. Actions are defined in the Camera class
 * @return {undefined}
 */
function setKeyEventHandler() {
    if (paused){
        return;
    }
    console.log("I'm in an important part of the program");
    console.log("paused " + paused);
    var flags = {};
    setInterval(function () { moveCamera(flags) }, 20);
    window.onkeyup = function (e) { 
        var c= String.fromCharCode (e.keyCode); 
        // if (c == 'Q'){
        //     camera1.fScale = 0;
        // }
        // if (c == 'A'){
        //     camera1.bScale = 0;
        // }
        // if (c == 'L'){
        //     camera2.fScale = 0;
        // }
        // if (c == 'K'){
        //     camera2.bScale = 0;
        // }
        //Q camera 1 move forward
        //A camera 1 move backward
        //L camera 2 move forward
        //K camera 2 move backward
        flags[c] = false;

    }
    window.onkeydown = function (e) {
        var c = String.fromCharCode(e.keyCode);
        flags[c] = true;
        if(c == 'R'){  
            //console.log("reset");
            camera1.resetAll();
            camera2.resetAll();
            render();
        }
    
        
        
        //lighting.keyAction(c);
        //document.getElementById("keypress").innerHTML = "<b>Key pressed:</b> " + c + "<br>";
        //render();
    };
}

function moveCamera(flags){
    if (paused){return};
    //console.log(flags);
    var dirty = false; 
    if (flags.A){
        camera1.turnLeft();
        dirty = true; 
    }
    if (flags.D){
        camera1.turnRight();
        dirty = true; 
    }
    if (flags.W){
        camera1.moveForward();
        dirty = true; 
    }
    if (flags.S){
        camera1.moveBackward();
        dirty = true; 
    }
    //need to decerlerate the camera if we are not moving forward or backward
    if (!flags.W && !flags.S){
        if (camera1.scale != 0){
            camera1.decelerate();
            dirty = true;
        }
        
    }
    if (flags.L){
        camera2.turnRight();
        dirty = true; 
    }
    if (flags.J){
        camera2.turnLeft();
        dirty = true; 
    }
    if (flags.I){
        camera2.moveForward();
        dirty = true; 
    }
    if (flags.K){
        camera2.moveBackward();
        dirty = true; 
    }
    if (!flags.I && !flags.K){
        if (camera2.scale != 0){
            camera2.decelerate();
            dirty = true;
        }
        
    }
    

    //if (camera1.scale != 0 || camera2.scale != 0){
        //dirty = true;
    //}
    if (dirty) {
        checkTankCollision();
        checkObstacleCollision();
        checkLeaveBoundary();
        checkEndGame();
        render (); 
    }
}

function checkPowerUp(){
    
    if (pUpOn){
        //console.log("on");
        var calcDistOne = function () {
            var xDistance = camera1.eye[0] + pUpCoords[0];
            var zDistance = camera1.eye[2] + pUpCoords[2];
            var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(zDistance, 2));
            return distance;
        };
    
        var calcDistTwo = function () {
            var xDistance = camera2.eye[0] + pUpCoords[0];
            var zDistance = camera2.eye[2] + pUpCoords[2];
            var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(zDistance, 2));
            return distance;
        };
    
        var calcDist = function () {
            var xDistance = camera1.eye[0] - camera2.eye[0];
            var zDistance = camera1.eye[2] - camera2.eye[2];
            var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(zDistance, 2));
            return distance;
        };
        if (calcDistOne() < tankRad){
            pUpTime = Date.now();
            if (pUpType==0){
                lives1++;
                document.getElementById("Tank1Life").innerHTML = "Tank 1 Lives Left: " + lives1;
            } else if (pUpType==1){
                damage1 = 3;
            } else if (pUpType==2){
                camera1.box = true;
                damage2 = 0;
            }
            pUpOn = false;
            render();
        }
        
        if (calcDistTwo() < tankRad){
            pUpTime = Date.now();
            if (pUpType==0){
                lives2++;
                document.getElementById("Tank2Life").innerHTML = "Tank 2 Lives Left: " + lives2;
            } else if (pUpType==1){
                damage2 = 3;
            } else if (pUpType==2){
                camera2.box = true;
                damage1 = 0;
            }
            pUpOn = false;
            render();
        }
    }
}

//this function returns the distance between the centers of the tanks
function calcDist(){
    var xDistance = camera1.eye[0] - camera2.eye[0];
    var zDistance = camera1.eye[2] - camera2.eye[2]; 
    var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(zDistance, 2)); 
    return distance;
}

function checkObstacleCollision(){
    
    //returns the distance between tank 1 and a given obstacle
    var calcDistOne = function (index) { 
        var xDistance = camera1.eye[0] + obstacleX[index];
        var zDistance = camera1.eye[2] + obstacleZ[index]; 
        var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(zDistance, 2)); 
        return distance;
    };

    //returns the distance between tank 2 and a given obstacle
    var calcDistTwo = function (index) { 
        var xDistance = camera2.eye[0] + obstacleX[index];
        var zDistance = camera2.eye[2] + obstacleZ[index]; 
        var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(zDistance, 2)); 
        return distance;
    };

   
    for (var i = 0; i < 5; i++){
        if (calcDistOne(i) < tankRad){
            camera1.scale *= -1/2;
        
        
            while (calcDistOne()){ 
                 camera1.move();
            }
            if (calcDist() < tankRad){
                camera2.scale = -0.2;
                while(calcDist() < tankRad){
                    camera2.move();
                }
            }
            
            if (!camera1.box)health1 -= Math.abs(Math.floor(50 * camera1.scale));
            render();
        }

        if (calcDistTwo(i) < tankRad){
            camera2.scale *= -1/2;
        
        
            while (calcDistOne()){ 
                 camera2.move();
            }
            if (calcDist() < tankRad){
                camera1.scale = -0.2;
                while(calcDist() < tankRad){
                    camera1.move();
                }
            }
            
                // while(calcDist() < tankRad){
                //     camera2.move();
                // }
            
            //at this point the tanks could be touching, move camera 2 back until they're not touching


            if (!camera2.box)health2 -= Math.abs(Math.floor(50 * camera2.scale));
            //document.getElementById("Tank1Health").innerHTML = "Tank 1 Health: "  + health1;
            render();
        }


    }

}

function checkTankCollision(){
  
    //check tank1 colliding with tank 2
    
    if (calcDist() < tankRad){


        
        var hit1Speed = Math.abs(camera1.scale);
        var hit2Speed = Math.abs(camera2.scale);
        //need to calculate which tank hit which
        
        //first I check for exceptional case of the slower tank hitting the faster tank from a blind side angle
        //for this to happen the dot product of collision must be positive or zero, otherwise it's not a blind side hit
        
        var doubleHit = false; //this occurs when both tanks hit each other, ie, the dot product is negative
        var blindHit1 = false; //this occurs when there is a blind side hit by tank 1
        var blindHit2 = false; //this occurs when there is a blind side hit by tank 2
        var dotP = dot(camera1.viewRotation[2], camera2.viewRotation[2]);
        if (dotP >= 0){
            
                //check if tank 1 is still touching tank 2 after moving back
                //if it's not still touching it's a blind side hit by tank 1, otherwise it's a blind side hit by tank2
                camera1.scale *= -1;
                camera1.move();
                if (calcDist() > tankRad){
                    blindHit1 = true;
                }else{
                    blindHit2 = true;
                }
                camera1.scale *= -1;
                camera1.move();
            
        }else{ //if the dot product is negative, then both tanks are hitting each other
            doubleHit = true;
        }
        //if it's a blind side hit the fast tank get's damaged and nothing happens to the slow tank    
        //otherwise the faster tank definitely hurt the smaller tank.
        //console.log("blindSideHit By Tank1: " + blindHit1);
        //console.log("blindSideHit By Tank2: " + blindHit2);
        //console.log("doubleHit: " + doubleHit);
        


        //console.log(hit1Speed);
        // camera1.resetAll();
        // camera2.resetAll();
        // camera1.resetAll();
        // camera2.resetAll();
        
        if (Math.abs(dotP * camera1.scale) < 0.2 && Math.abs(dotP * camera2.scale) < 0.2){
            //console.log("fixing bug where dotProduct is very small")
            camera1.scale *= -1/2;
            camera2.scale *= -1/2;
        }else{

            camera2.scale *= dotP;
            camera1.scale *= dotP;
            
            //console.log("dot Product " + dotP);
            var interm = camera2.scale; 
            camera2.scale = camera1.scale/2; 
            camera1.scale = interm/2; 
        }
            // if (camera1.scale < 0.1 && camera1.scale > -0.1){
            //     camera1.scale = 0.1;

            // }
        while(calcDist() < tankRad){
            camera2.move();
            camera1.move();
        }
        
        // camera2.move();
        // camera2.move();
        
        
        // camera1.move();
        // camera1.move();
        if (doubleHit){
            health1 -= Math.floor(50 * hit2Speed)*damage2;
            health2 -= Math.floor(50 * hit1Speed)*damage1;
        }else if (blindHit1){
            //we have a blind side hit from tank 1
            health2 -= Math.floor(50 * hit1Speed)*damage1;
        }else{
            //we have a blind side hit from tank 2
            health1 -= Math.floor(50 * hit2Speed)*damage2;
        }
        //document.getElementById("Tank1Health").innerHTML = "Tank 1 Health: "  + health1;
        //document.getElementById("Tank2Health").innerHTML = "Tank 2 Health: "  + health2;
        render();
        
    }
}

function checkLeaveBoundary(){
    //check for tank1 leaving the boundary of the game
     var calcOutsideOne = function(){
        var outside = camera1.eye[0] + tankRad >= arenaLength || camera1.eye[0] - tankRad <= -arenaLength || camera1.eye[2] + tankRad >= arenaLength ||
        camera1.eye[2] - tankRad <= -arenaLength;
        return outside;
     }; 
     if (calcOutsideOne()){
        //camera1.resetAll();
        //camera2.resetAll();
        camera1.scale *= -1/2;
        
        
        while (calcOutsideOne()){ 
             camera1.move();
             //console.log(camera1.scale);
             //console.log("moving tank 1 away from the wall");
        }
        if (calcDist() < tankRad){
            camera2.scale = -0.2;
            while(calcDist() < tankRad){
                camera2.move();
            }
        }
        
            // while(calcDist() < tankRad){
            //     camera2.move();
            // }
        
        //at this point the tanks could be touching, move camera 2 back until they're not touching


        if (!camera1.box)health1 -= Math.abs(Math.floor(50 * camera1.scale));
        //document.getElementById("Tank1Health").innerHTML = "Tank 1 Health: "  + health1;
        render();
    }
    
    var calcOutsideTwo = function(){
        var outside = camera2.eye[0] + tankRad >= arenaLength || camera2.eye[0] - tankRad <= -arenaLength || camera2.eye[2] + tankRad >= arenaLength ||
        camera2.eye[2] - tankRad <= -arenaLength
        return outside;
     }; 
    //check for tank2 leaving the boundary of the game
    if (calcOutsideTwo()){
        // camera1.resetAll();
        // camera2.resetAll();
        camera2.scale *= -1/2;

        
        while (calcOutsideTwo()){
            //console.log(calcOutsideTwo);
            //console.log("moving tank 2 away from the wall");
             camera2.move();
        }

        if (calcDist() < tankRad){
            camera1.scale = -0.2;
            while(calcDist() < tankRad){
                camera1.move();
            }
        }

       
        // while(calcDist() < tankRad){
        //     camera1.move();
        // }

        
        
        
        
        if (!camera2.box)health2 -= Math.abs(Math.floor(50 * camera2.scale));
        //document.getElementById("Tank2Health").innerHTML = "Tank 2 Health: "  + health2;
        render();
    }
    
}


function checkEndGame(){
       // console.log("I'm here");
        if (health1 < 0){
            health1 = 1000;
            //document.getElementById("Tank1Health").innerHTML = "Tank 1 Health: "  + health1;
            
            lives1--;
            if (lives1 > 0){
                camera1.resetAll();
                camera2.resetAll();
                document.getElementById("Tank1Life").innerHTML = "Tank 1 Lives Left: " + lives1;
            }else{
                endGame("2");
            }



        }
        if (health2 < 0){
            health2 = 1000; 
            //document.getElementById("Tank2Health").innerHTML = "Tank 2 Health: "  + health2;
            
            lives2--;
            if (lives2 > 0){
                camera1.resetAll();
                camera2.resetAll();
                document.getElementById("Tank2Life").innerHTML = "Tank 2 Lives Left: " + lives2;
            }else{
                endGame("1");
            }
        }

}

function endGame(winner){
    lives1 = startingLife;
    lives2 = startingLife;
    health1 = 1000;
    health2 = 1000;
    document.getElementById("restartGame").innerHTML = "Tank " + winner + " wins the game!!! Right click to restart";
    paused = true;
    console.log("just updated paused " + paused);
    damage1 = 1;
    damage2 = 1;
    camera1.box = false;
    camera2.box = false;

    //render();
    //while(true){

    //}
    //camera1.resetAll();
    //camera2.resetAll();
}

window.oncontextmenu = function ()
{
    if (!paused){ //if the game is not paused we don't want this function to do anything
        return;
    }
    document.getElementById("restartGame").innerHTML = "";
    paused = false;
    camera1.resetAll();
    camera2.resetAll();
    document.getElementById("Tank1Life").innerHTML = "Tank 1 Lives Left: " + lives1;
    document.getElementById("Tank2Life").innerHTML = "Tank 2 Lives Left: " + lives2;
    render();
}




