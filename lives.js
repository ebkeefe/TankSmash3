function drawLives(lives){
    stack.push()
    //console.log(lives);
    stack.multiply(translate(-.5,11.2,4));
    stack.multiply(scalem(.01,.3,.3));
    for (var i = 0; i< lives; i++){
        stack.multiply(translate(0,0,-2));
        gl.uniform4fv(uColor, vec4(1.0, 0.0, 0.0, 1.0));
        gl.uniform1i(uMode, 4);
        activateTexture(gl, pUpTextures[0]);
        gl.uniformMatrix4fv(uModel_view, false, flatten(stack.top()));
        Shapes.drawPrimitive(Shapes.cube);
    }
    stack.pop();
}