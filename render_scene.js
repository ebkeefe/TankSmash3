
var sepW = 5; //seperating the screens


var tankRad = 20;
var arenaLength = 300;
//the center of the tank should be at the eye of the cameras

var obstacleX = [200, 40, -120, 8, 60];
var obstacleZ = [40, 200, 314, -10, -90];

var canvas;       // HTML 5 canvas
var gl;           // webgl graphics context
var vPosition;    // shader variable attrib location for vertices 
var vColor;       // shader variable attrib location for color
var vNormal;	  // shader variable attrib normals for vertices
var colorMode;
var vTexCoords;   //shader variable attrib texture for vertices
var uColor;       // shader uniform variable location for color
var uProjection;  //  shader uniform variable for projection matrix
var uModel_view;  //  shader uniform variable for model-view matrix
var uTexture      //shader uniform variable for the texture
var uNumLights; //uniform variable for the number of lights

var uMode; //uniform variable for color mode

var pUpCoords = [arenaLength/2,1,arenaLength/2];
var pUpOn = true;
var pUpType = 2; //Math.floor(3*Math.random());
//var pUpType = 2;

var pUpTime = Date.now();

var tankTexture;
var wheelTexture;
var chainTexture;
var dirtTexture;
var asphaltTexture;
var crowdTexture;
var trashTexture;
var pUpTextures = new Array();

//texture variables
var checkerboard;
var stripes;
var pokadot;

var camera1 = new Camera(); 
var camera2 = new Camera();
camera1.id = "camera1"
camera2.id = "camera2"
camera2.eye_start = vec4(0, 0, -80, 1);
camera2.VPN = scale(-1, camera2.VPN);
camera2.reset();

var stack = new MatrixStack();

var dayLighting = new Lighting(0, 60, 0);

var program;

window.onload = function init() {
    // document.getElementById("scenerotation").addEventListener("input", function(){ //loads range inputs from html
    //     thetaY = document.getElementById("scenerotation").value;
    // });
    // document.getElementById("turret").addEventListener("input", function(){
    //     turrTheta = document.getElementById("turret").value;
    // })
    // document.getElementById("wheels").addEventListener("input", function(){
    //     wheelTheta = document.getElementById("wheels").value;
    // });

    //set Event Handlers
    

    
    
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    
    startGame();
    
};

function startGame(){
    setKeyEventHandler();
    setMouseEventHandler();
    wheelTheta = 180;
    thetaY = 180;
    turrTheta = 0;
    
    checkerboard = new Checkerboard(gl);
    stripes = new Stripes();
    pokadot = new Pokadot();
    tankTexture = loadTexture(gl, 'textures/industrial_low_resolution.png');
    tankTextureDamage = loadTexture(gl, 'textures/industrial_low_resolution_red.png');
    wheelTexture = loadTexture(gl, 'textures/wheel_low_resolution.png');
    chainTexture = loadTexture(gl, 'textures/chain_low_resolution.png');
    dirtTexture = loadTexture(gl, 'textures/dirt.png');
    asphaltTexture = loadTexture(gl, 'textures/asphalt.png');
    crowdTexture = loadTexture(gl, 'textures/crowd.png');
    trashTexture = loadTexture(gl, 'textures/trash.png');
    pUpTextures[0] = loadTexture(gl, 'textures/health.png');
    pUpTextures[1] = loadTexture(gl, 'textures/strength.png');
    pUpTextures[2] = tankTexture;
    
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.309, 0.505, 0.74, 1.0);
    
    gl.enable(gl.DEPTH_TEST);
    
    
    //  Load shaders
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    dayLighting.setUp();
    
       
    
    
    shaderSetup();
    
    Shapes.initShapes();  // crate the primitive and other shapes
    
    render();
    
}

/**
 *  Load shaders, attach shaders to program, obtain handles for 
 *  the attribute and uniform variables.
 * @return {undefined}
 */
function shaderSetup() {
    //  Load shaders
    // var program = initShaders(gl, "vertex-shader", "fragment-shader");
    // gl.useProgram(program);

    // get handles for shader attribute variables. 
    // We will need these in setting up buffers.
    vPosition = gl.getAttribLocation(program, "vPosition");
    vColor = gl.getAttribLocation(program, "vColor"); // we won't use vertex here
    vNormal = gl.getAttribLocation(program, "vNormal");
    vTexCoords = gl.getAttribLocation(program, "vTexCoords");
                          // colors but we keep it in for possible use later.
   
    // get handles for shader uniform variables: 
    uColor = gl.getUniformLocation(program, "uColor");  // uniform color
    uProjection = gl.getUniformLocation(program, "uProjection"); // projection matrix
    uModel_view = gl.getUniformLocation(program, "uModel_view");  // model-view matrix
    uTexture = gl.getUniformLocation(program, "uTexture");  // uniform color
    uMode = gl.getUniformLocation(program, "uMode");  // uniform color
    uNumLights = gl.getUniformLocation(program, "uNumLights");  // uniform number of lights

}

function render(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniform1i(uNumLights, 1); //passing in number of lights

    var projMat = camera1.calcProjectionMat(canvas.width/2, canvas.height);   // Projection matrix  
    gl.uniformMatrix4fv(uProjection, false, flatten(projMat));
    
    var viewMat = camera1.calcViewMat();   // View matrix
    gl.viewport( 0, 0, canvas.width/2.0 - sepW/2, canvas.height );
    renderScene(viewMat, 1);

    var viewMat = camera2.calcViewMat();   // View matrix
    gl.viewport( canvas.width/2 + sepW/2, 0, canvas.width/2 - sepW/2, canvas.height );
    renderScene(viewMat, 2);

    gl.viewport(canvas.width/2 - sepW/2, 0, sepW, canvas.height );
    gl.disable(gl.DEPTH_TEST);
    gl.uniformMatrix4fv(uProjection, false, flatten(mat4()));
    gl.uniformMatrix4fv(uModel_view, false, flatten(mat4()));
    gl.uniform4fv(uColor, vec4(1.0, 1.0, 1.0, 1.0));
    gl.uniform1i(uMode, 4);
    Shapes.drawPrimitive(Shapes.cube);
    gl.enable(gl.DEPTH_TEST);
    

    // gl.viewport( 0, canvas.width/2.08, canvas.width/1.94, canvas.height );
    // renderScene(viewMat, true);
    
    powerUp();

}

function loopStuff () { 
    checkCollision ();
    render (); 
}

function powerUp(){
    //console.log(Date.now());
    checkPowerUp();
    powerUpReset();
}

function powerUpReset(){
    if (damage1>1||damage2>1){
        if (Date.now()-pUpTime>17000){
            damage1 = 1;
            damage2 = 1;
        }
    }
    if (camera1.box||camera2.box){
        if (Date.now()-pUpTime>17000){
            camera1.box=false;
            camera2.box=false;
            damage1 = 1;
            damage2 = 1;
        }
    }
    if (!pUpOn){
        if (Date.now()-pUpTime>22000){
            pUpCoords = [Math.floor(arenaLength/2*Math.random()),1,Math.floor(arenaLength/2*Math.random())];
            pUpOn = true;
            pUpType = Math.floor(pUpTextures.length*Math.random())
            console.log("reset *******************************************");
        }
    }
    //console.log(Date.now()-pUpTime);
}

function drawPowerUp(){
    if(pUpOn){
        stack.push();
        stack.multiply(translate(pUpCoords));
        stack.multiply(scalem(5,5,5));
        gl.uniform4fv(uColor, vec4(1.0, 1.0, 1.0, 1.0));
        gl.uniform1i(uMode, 2);
        activateTexture(gl,pUpTextures[pUpType]);
        gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
        Shapes.drawPrimitive(Shapes.cube);
        //console.log("power up drawn")
        stack.pop();
    }
}



function renderScene(viewMat, tankNumber)
{
    
    // if (dummy){
    //     console.log("drwaing the seperating border");
    //     stack.push();
    //     //stack.multiply(translate(viewMat));
    //     stack.multiply(scalem(20, 20, 20));
    //     gl.uniform4fv(uColor, vec4(1.0, 1.0, 1.0, 1.0));
    //     gl.uniform1i(uMode, 1);
    //     gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    //     Shapes.drawPrimitive(Shapes.cube);
    //     //console.log("power up drawn")
    //     stack.pop();
    //     return;
    // }
    
    //checkCollision();
    camera1.move();
    camera2.move();

    

     //drawing the tank
    stack.clear();

    stack.push();
    checkerboard.activate(); 
    stack.multiply(translate(0,-3,-5)); 
    stack.push();
    stack.multiply (viewMat); 
    stack.multiply (inverse (camera1.calcViewMat ()));
    
    
    

    gl.uniform4fv(uColor, vec4(1.0, 0.0, 0.0, 1.0)); 
    gl.uniform1i(uMode, 2);
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    drawTank(camera1.theta1, health1,1);
    
    if(camera1.box)drawTankBox();

    stack.multiply(translate(-1/2*camera1.scale,0,0));
    if (tankNumber==1)drawLives(lives1);
    
    stack.pop();

    stack.push();

    stack.multiply (viewMat); 
    stack.multiply (inverse (camera2.calcViewMat ())); 

    gl.uniform4fv(uColor, vec4(1.0, 0.0, 0.0, 1.0)); 
    gl.uniform1i(uMode, 2);
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    
    drawTank(camera2.theta2, health2,2);
    
    if(camera2.box)drawTankBox();

    stack.multiply(translate(-1/2*camera2.scale,0,0));
    if (tankNumber==2) drawLives(lives2);

    stack.pop();

    stack.pop();

    stack.multiply(viewMat);
    
    var newLight = mult(viewMat, dayLighting.light_position); 
    gl.uniform4fv(uLight_position, newLight);
        
    
    
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    //Shapes.axis.draw();
   
   
    
    //drawing another square that should be fixed in place
    // stack.push();
    // stack.multiply(translate(10, 0, 10));
    // stripes.activate();
    // gl.uniform4fv(uColor, vec4(1.0, 0.0, 0.0, 1.0)); 
    // gl.uniform1i(uMode, 1);
    // gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    // Shapes.drawPrimitive(Shapes.cube);
    // stack.pop();

    //drawing the floor
    stack.push();
    stack.multiply(scalem(arenaLength, 1, arenaLength));
    stack.multiply(translate(0, -10, 0));
    //dirtTexture.activate();
    activateTexture(gl,dirtTexture);
    gl.uniform4fv(uColor, vec4(0.4, 0.4, 0.4, 1.0)); 
    gl.uniform1i(uMode, 2);
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();

    //drawing the arena sides
    stack.push();
    stack.multiply(scalem(1, 100, arenaLength*2));
    stack.multiply(translate(arenaLength, 0, 0));
    activateTexture(gl, crowdTexture);
    
    gl.uniform4fv(uColor, vec4(0.3, 0.3, 0.3, 1.0)); 
    gl.uniform1i(uMode, 2);
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();

    //drawing the arena sides
    stack.push();
    stack.multiply(scalem(1, 100, arenaLength*2));
    stack.multiply(translate(-arenaLength, 0, 0));
    activateTexture(gl, crowdTexture);
    
   
    gl.uniform4fv(uColor, vec4(0.3, 0.3, 0.3, 1.0)); 
    gl.uniform1i(uMode, 2);
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();

    //drawing the front and back of the arena
    stack.push();
    stack.multiply(scalem(arenaLength*2, 100, 1));
    stack.multiply(translate(0, 0, -arenaLength));
    activateTexture(gl, crowdTexture);
    
    //pokadot.activate();
    gl.uniform4fv(uColor, vec4(0.3, 0.3, 0.3, 1.0)); 
    gl.uniform1i(uMode, 2);
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();

    //drawing the front and back of the arena
    stack.push();
    stack.multiply(scalem(arenaLength*2, 100, 1));
    stack.multiply(translate(0, 0, arenaLength));
    activateTexture(gl, crowdTexture);
    //pokadot.activate();
    gl.uniform4fv(uColor, vec4(0.3, 0.3, 0.3, 1.0)); 
    gl.uniform1i(uMode, 2);
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    Shapes.drawPrimitive(Shapes.cube);
    stack.pop();
    
    drawPowerUp();

    // for (var i =0; i < 6; i++){
    //     //drawing the light   
    //     stack.push();
    //     stack.multiply(translate(lighting.light_position[0], lighting.light_position[1], lighting[i].light_position[2]));
    //     stripes.activate();
    //     gl.uniform4fv(uColor, vec4(1.0, 0.3, 0.0, 1.0)); 
    //     gl.uniform1i(uMode, 4);r
    //     gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    //     Shapes.drawPrimitive(Shapes.cube);

    //     stack.pop(); 
    // }

    for (var i =0; i<obstacleX.length; i++){
        //drawing some obstacles
        stack.push();
        stack.multiply(translate(obstacleX[i], -8, obstacleZ[i]));
        stripes.activate();
        stack.multiply(scalem(5, 10, 5));
         activateTexture(gl, trashTexture);
        gl.uniform4fv(uColor, vec4(0.5, 0.5, 0.5, 1.0)); 
        gl.uniform1i(uMode, 2);
        gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
        Shapes.drawPrimitive(Shapes.cylinder);
        stack.pop(); 
    }

    //draw the front and back of the arena
    // stack.push();
    // stack.multiply (viewMat); 
    // stack.multiply (inverse (camera2.calcViewMat ())); 

    
    // stack.pop();

    //calculate the center of the tank

    
   
}

function drawTankBox(){
    stack.multiply(scalem(10,10,10));
    stack.multiply(rotateY(90));
    gl.uniform4fv(uColor, vec4(1.0, 0.0, 0.0, 1.0));
    gl.uniform1i(uMode, 2);
    gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
    Shapes.drawPrimitive(Shapes.cube2);
    
}

function drawShape(shape,wireBool){
    //shape.wire = wireBool;
    Shapes.drawPrimitive(shape);
}

