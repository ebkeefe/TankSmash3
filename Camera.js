/**
 * Contains all of the parameters needed for controlling the camera.
 * @return {Camera}
 */
//var eyeLocation = vec4([0, 0, 0, 0]);
var rotation;
var alpha = .5;

var maxScale = 3;

function Camera() {
    this.box = false;
    this.id = ""
    this.theta1 = 0;
    this.theta2 = 0;
    
    this.fov = 60;           // Field-of-view in Y direction angle (in degrees)
    this.zNear = 0.2;        // camera's far plane
    this.zFar = 800;         // camera's near plane

// Camera *initial* location and orientation parameters
    //this.eye_start = vec4([0, 4, 25, 1]); // initial camera location (needed for reseting) 
    this.scale = 0;
    this.eye_start = vec4([0, 0, 80, 1]); 
    this.VPN = vec4([0, 0, 1, 0]);  // used to initialize uvn
    this.VUP = vec4([0, 1, 0, 0]);  // used to initialize uvn  

// Current camera location and orientation parameters
    this.eye = vec4(this.eye_start);     // camera location
    eyeLocation = this.eye;
    this.viewRotation;  // rotational part of matrix that transforms between World and Camera coord  
    rotation = this.viewRotation; 

    this.calcUVN();  // initializes viewRotation
}

/**
 * Reset the camera location and orientation
 * @return none
 */
Camera.prototype.reset = function () {
    this.eye = vec4(this.eye_start);
    this.scale = 0;
    eyeLocation = this.eye;
    this.calcUVN();
    //render();
};

/**
 * Calculate the *initial* viewRotation matrix of camera
 * based on VPN and VUP
 * @return none
 */
Camera.prototype.calcUVN = function () {
    this.viewRotation = mat4(1);  // identity - placeholder only

// TO DO:  COMPLETE THIS CODE---DONE
    var n = vec4(normalize(this.VPN, true));
    var u = vec4(normalize(cross(n, this.VUP), true), 0);
    
    this.n = n;

    var v = vec4(normalize(cross(u, n), true), 0);
    
    var R1 = [u,v, negate(n), vec4(0,0,0,1)];
    
    this.viewRotation = R1;
    
    //console.log("View Rotation Matrix: ");
    //printm(this.viewRotation);
    
    this.viewRotation.matrix = true;
};

/**
 * Calculate the camera's view matrix given the 
 * current eye and viewRotation
 * @return view matrix (mat4)
 */
Camera.prototype.calcViewMat = function () {
    var mv = mat4(1);  // identity - placeholder only
    //
// TO DO:  COMPLETE THIS CODE---DONE
   var eyeTranslate = translate(this.eye[0], this.eye[1]-3, this.eye[2]);
   
   var mv = mult(this.viewRotation, eyeTranslate);
//   var mv = mult (eyeTranslate, this.viewRotation); 
   //console.log("View Matrix: ");
   //printm(mv);
   return mv;
};

/** 
 * Calculate the camera's projection matrix. Here we 
 * use a perspective projection.
 * @return the projection matrix
 */
Camera.prototype.calcProjectionMat = function (width, height) {
    if (arguments.length == 0){
    	throw "camera.calcProjectionMat(): need to provide width and height";
    }
    aspect = width / height;
    return perspective(this.fov, aspect, this.zNear, this.zFar);
};

/**
 * Update the camera's eye and viewRotation matrices 
 * based on the user's mouse actions
 * @return none
 */
Camera.prototype.keyAction = function (key) {
   
};

Camera.prototype.resetAll = function(){
	this.reset();
}

Camera.prototype.turnLeft = function(){
	this.viewRotation = mult(rotateY(alpha*4), this.viewRotation);
}

Camera.prototype.turnRight = function(scale){
	this.viewRotation = mult(rotateY(-alpha*4), this.viewRotation);
}

Camera.prototype.moveForward = function(){
    // if (this.scale < 0){
    //     this.scale = 0;
    // }

    if (this.scale < maxScale){
        this.scale +=0.1;
    }
	// this.eye = add(this.eye,scale(alpha*this.scale, this.viewRotation[2]));
 //    this.theta+=2;
 //    Shapes.hollowCylinder = new HollowCylinder(50,this.theta);
 //    Shapes.initBuffers(Shapes.hollowCylinder);
 //    Shapes.cubeMove = new CubeMove(this.theta);
 //    Shapes.initBuffers(Shapes.cubeMove);
}

Camera.prototype.moveBackward = function(){
    // if (this.scale > 0 ){
    //     this.scale = 0;
    // }
	if (this.scale < maxScale){
        this.scale -=0.1;
    }
   
}

//if neither the forward nor backwards buttons are being pressed return to the equilibirum speed
Camera.prototype.decelerate = function(){
    if (this.scale > -0.1 && this.scale < .1){
        this.scale = 0;
    }
        // if (this.scale == 0){
        //     return;
        // }
    if (this.scale < 0){
        this.scale += 0.05;
    }else if (this.scale > 0){
        this.scale -= 0.05;
    }
}

Camera.prototype.move = function(){
    this.eye = add(this.eye,scale(alpha*this.scale,this.viewRotation[2]));
    var addTheta = 2;
    if (this.scale!=0){
        addTheta*=this.scale/Math.abs(this.scale);
    }
    if (this.scale!=0){
    if (this.id=="camera1"){
        this.theta1+=addTheta;
        Shapes.hollowCylinder1 = new HollowCylinder(50,this.theta1);
        Shapes.initBuffers(Shapes.hollowCylinder1);
        Shapes.cubeMove1 = new CubeMove(this.theta1);
        Shapes.initBuffers(Shapes.cubeMove1);
        //console.log("move1");
    } else {
        this.theta2+=addTheta;
        Shapes.hollowCylinder2 = new HollowCylinder(50,this.theta2);
        Shapes.initBuffers(Shapes.hollowCylinder2);
        Shapes.cubeMove2 = new CubeMove(this.theta2);
        Shapes.initBuffers(Shapes.cubeMove2);
        //console.log("move2");
    }
    }
}
