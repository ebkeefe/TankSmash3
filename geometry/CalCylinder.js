///// CUBE DEFINTION
/////
///// Cube is defined to be centered at the origin of the coordinate reference system. 
///// Cube size is assumed to be 2.0 x 2.0 x 2.0 .

///// Generate 12 triangles: 36 vertices and 36 colors
/////    v6----- v7
/////   /|      /|
/////  v2------v3|              ^ y
/////  | |     | |              |
/////  | |v4---|-|v5             -->x
/////  |/      |/              /
/////  v0------v1              z
///// Always use the Right Hand Rule to generate vertex sequence. We want outward facing normals.
function CalCylinder(n) {
    this.wire = false;

    this.name = "disk";

    
    this.numVertices = n*12;
    this.numTriangles = this.numVertices / 3;

    this.vertices = [this.numVertices];
    this.colors = [this.numVertices];
    this.normals = [this.numVertices];
    this.vTexCoords = [this.numVertices];

    


    // These are the actual vertices and colors to be placed in the vertex buffers.

    
    
    /*
    this.vertices[0] = vec4(0.0,0.0,1.0,1.0);
    
    
    this.vertices[1] = vec4(0,1,0,1);
             this.vertices[2] = vec4(.2,.8,0,1);
    for (var j = 0; j < 3; j++) {
            this.colors[j] = vec4(0.0, 0.0, 1.0, 1.0);
            this.normals[j] = vec4(1.0, 1.0, 1.0, 0.0);
            this.vTexCoords[j] = vec2(1, 0);
        }
     */
    
    for(var i = 0; i <n; i++){
        
        var matr = vertMatrixCylendarUp(i,n);
        var texMat = this.texMat(i%(n/3.14),n,"up");
        for (var j = 0; j < 3; j++) {
            var q = i*3+j;
            this.vertices[q] = matr[j];
            this.colors[q] = vec4(Math.cos((i/(n))*Math.PI*2), Math.sin((i/(n))*Math.PI*2), -Math.cos((i/(n))*Math.PI*2), 1.0);
            this.normals[q] = normalize(vec4(matr[j][0],0,matr[j][2],0),true);
            this.vTexCoords[q] = texMat[j];
        }
    }
    
    
     
    for(var i = 0; i <n; i++){
        
        var matr = vertMatrixCylendarCaps(i,n,-1);
        var texMat = this.texMat(i,n,"bottom");
        for (var j = 0; j < 3; j++) {
            var q = (1*n+i)*3+j;
            this.vertices[q] = matr[j];
            this.colors[q] = vec4(Math.cos((i/(n))*Math.PI*2), Math.sin((i/(n))*Math.PI*2), -Math.cos((i/(n))*Math.PI*2), 1.0);
            this.normals[q] = vec4(0.0, -1.0, 0.0, 0.0);
            this.vTexCoords[q] = texMat[j];
        }
    }
    for(var i = 0; i <n; i++){
        
        var matr = vertMatrixCylendarCaps(i,n,1);
        var texMat = this.texMat(i,n,"top");
        for (var j = 0; j < 3; j++) {
            var q = (2*n+i)*3+j;
            this.vertices[q] = matr[j];
            this.colors[q] = vec4(Math.cos((i/(n))*Math.PI*2), Math.sin((i/(n))*Math.PI*2), -Math.cos((i/(n))*Math.PI*2), 1.0);
            this.normals[q] = vec4(0.0, 1.0, 0.0, 0.0);
            this.vTexCoords[q] = texMat[j];
        }
    }
    for(var i = 0; i <n; i++){
        
        var matr = vertMatrixCylendarDown(i,n);
        var texMat = this.texMat(i%(n/3.14),n,"down");
        for (var j = 0; j < 3; j++) {
            var q = (3*n+i)*3+j;
            this.vertices[q] = matr[j];
            this.colors[q] = vec4(Math.cos((i/(n))*Math.PI*2), Math.sin((i/(n))*Math.PI*2), -Math.cos((i/(n))*Math.PI*2), 1.0);
            this.normals[q] = normalize(vec4(matr[j][0],0,matr[j][2],0),true);
            this.vTexCoords[q] = texMat[j];
        }
    }
}

CalCylinder.prototype.texMat= function(i,n,id){
    if (id == "up") return [vec2(3.14*i/n/2,1),vec2(3.14*i/n/2,0),vec2(3.14*(i+1)/n/2,0)];
    else if (id == "down") return [vec2(3.14*i/n/2,1),vec2(3.14*(i+1)/n/2,0),vec2(3.14*(i+1)/n/2,1)];
    else if (id == "bottom" || id=="top") {
        //console.log([vec2(.5,.5),vec2(Math.cos((i/(n)*Math.PI*2))/2+.5,Math.sin((i/(n))*Math.PI*2)/2+.5),vec2(Math.cos(((i+1)/(n))*Math.PI*2)/2+.5,Math.sin(((i+1)/(n))*Math.PI*2)/2+.5)]);
    return [vec2(.5,.5),vec2(Math.cos((i/(n)*Math.PI*2))/2+.5,Math.sin((i/(n))*Math.PI*2)/2+.5),vec2(Math.cos(((i+1)/(n))*Math.PI*2)/2+.5,Math.sin(((i+1)/(n))*Math.PI*2)/2+.5)];
    }
    return [vec2(i/n,1),vec2(i/n,-1),vec2((i+1)/n,-1)];
}

function vertMatrixCylendarUp(j,n){
    return [vec4(Math.cos((j/(n))*Math.PI*2),1,Math.sin((j/(n))*Math.PI*2),1.0),
            vec4(Math.cos((j/(n))*Math.PI*2),-1,Math.sin((j/(n))*Math.PI*2),1.0),
            vec4(Math.cos(((j+1)/(n))*Math.PI*2),-1,Math.sin(((j+1)/(n))*Math.PI*2),1.0)];
}

function vertMatrixCylendarDown(j,n){
    return [vec4(Math.cos((j/(n))*Math.PI*2),1,Math.sin((j/(n))*Math.PI*2),1.0),
            vec4(Math.cos(((j+1)/(n))*Math.PI*2),-1,Math.sin(((j+1)/(n))*Math.PI*2),1.0),
            vec4(Math.cos(((j+1)/(n))*Math.PI*2),1,Math.sin(((j+1)/(n))*Math.PI*2),1.0)];
}

function vertMatrixCylendarCaps(j,n,yVal){
    return [vec4(0.0,yVal,0.0,1.0),
            vec4(Math.cos((j/(n))*Math.PI*2),yVal,Math.sin((j/(n))*Math.PI*2),1.0),
            vec4(Math.cos(((j+1)/(n))*Math.PI*2),yVal,Math.sin(((j+1)/(n))*Math.PI*2),1.0)];
}

