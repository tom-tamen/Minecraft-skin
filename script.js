let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");


const multiplier = 1;

let img = new Image();
img.crossOrigin = "anonymous"; // Ajouter l'attribut crossorigin
img.src = "./st2.png";

let faceDraw = document.getElementById("faceDraw");

let face = []
let headBack = []
let headRight = []
let headLeft = []
let headTop = []
let headBottom = []

img.onload = function () {

    let Fwidth = img.width * multiplier;
    let Fheight = img.height * multiplier;


    canvas.width = Fwidth;
    canvas.height = Fheight;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, Fwidth, Fheight);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    //let currentPart = "";
    for (let col = 0; col < canvas.width; col++) {
        let rowPush = [];
        for (let row = 0; row < canvas.height; row++) {
            let index = (col + row * canvas.width) * 4;
            // if(col > 7 && col < 16 && row > -1 && row < 8){
            //     currentPart = "headTop";
            //     rowPush.push(canvaToMatrix(pixels, index));
            // }
            // else if(col > 16 && col < 24 && row > -1 && row < 7){
            //     currentPart = "headBottom";
            //     rowPush.push(canvaToMatrix(pixels, index));
            // }
            if (col > 7 * multiplier && col < 16 * multiplier && row > 7 * multiplier && row < 16 * multiplier) {
                currentPart = "face";
                rowPush.push(canvaToMatrix(pixels, index));
            } 
            else if(col>23 && col < 32 && row > 7 && row < 16){
                currentPart = "headBack";
                rowPush.push(canvaToMatrix(pixels, index));
            }
            else if(col > -1 && col < 8 && row > 7 && row <= 16){
                currentPart = "headRight";
                rowPush.push(canvaToMatrix(pixels, index));
            }else if(col > 15 && col < 24 && row > 7 && row < 16){
                currentPart = "headLeft";
                rowPush.push(canvaToMatrix(pixels, index));
            }
            

            else {
                pixels[index + 3] = 0;
            }

        }
        
        if (rowPush.length > 0) {
            switch (currentPart) {
                case "face":
                    face.push(rowPush);
                    break;
                case "headBack":
                    headBack.push(rowPush);
                    break;
                case "headRight":
                    headRight.push(rowPush);
                    break;
                case "headLeft":
                    headLeft.push(rowPush);
                    break;
                case "headTop":
                    headTop.push(rowPush);
                    break;
                case "headBottom":
                    headBottom.push(rowPush);
                    break;
            }
        }


    }
    ctx.putImageData(imageData, 0, 0);

    face.reverse();
    face = rotate90Clockwise(face);
    
    headTop.reverse();
    headTop = rotate90Clockwise(headTop);

    
    for (let col = 0; col < face.length; col++) {
        for (let row = 0; row < face[col].length; row++) {
            let pixelDiv = document.createElement("div");

            pixelDiv.classList.add("pixel");
            pixelDiv.style.width = faceDraw.offsetWidth / 8 + "px";
            pixelDiv.style.height = faceDraw.offsetHeight / 8 + "px";
            pixelDiv.style.display = "block";
            pixelDiv.style.aspectRatio = "1/1";
            pixelDiv.style.backgroundColor = `rgb(${face[col][row].r}, ${face[col][row].g}, ${face[col][row].b})`;
            pixelDiv.dataset.id = col + "-" + row;
            faceDraw.appendChild(pixelDiv);
            //console.log('ok'+`rgb(${headTop[col][row].r}, ${headTop[col][row].g}, ${headTop[col][row].b})`);
        }
    }



    // ============================Three.js============================

    const canvas3D = document.querySelector('#render3D')

    const sizes = {
        width: 800,
        height: 600
    }

    const scene = new THREE.Scene()


    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    camera.position.z = 20
    scene.add(camera)



    let head = new THREE.Group();

    //face = rotate90Clockwise(face); color: `rgb(${face[x][y].r}, ${face[x][y].g}, ${face[x][y].b})


    let iX = 0;
    let iY = 0;
    let iZ = 0;
    face= rotate90Clockwise(face);

    headBack.reverse()
    headBack = rotate90Clockwise(headBack);
    headBack = rotate90Clockwise(headBack);


    headLeft.reverse();
    headLeft = rotate90AntiClockwise(headLeft);
    
    headRight = rotate90AntiClockwise(headRight);


    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            for (let z = 0; z < 8; z++) {
                const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
                

                let materialFront = new THREE.MeshBasicMaterial();
                let materialBack = new THREE.MeshBasicMaterial();
                let materialTop = new THREE.MeshBasicMaterial();
                let materialBottom = new THREE.MeshBasicMaterial();
                let materialRight = new THREE.MeshBasicMaterial();
                let materialLeft = new THREE.MeshBasicMaterial();
                let cubeMaterials = [ materialRight, materialLeft, materialTop, materialBottom, materialFront, materialBack ];
                
                if(z == 7){
                    materialFront.color.setRGB( face[x][y].r / 255, face[x][y].g / 255, face[x][y].b / 255 );
                }else if(z == 0){
                    materialBack.color.setRGB(headBack[x][y].r / 255, headBack[x][y].g / 255, headBack[x][y].b / 255);
                }

                if(x == 7){
                    materialRight.color.setRGB(headLeft[y][z].r / 255, headLeft[y][z].g / 255, headLeft[y][z].b / 255);
                }else if(x == 0){
                    materialLeft.color.setRGB(headRight[y][z].r / 255, headRight[y][z].g / 255, headRight[y][z].b / 255);
                }

                // if(y == 7){
                //     materialTop.color.setRGB(headTop[x][z].r / 255, headTop[x][z].g / 255, headTop[x][z].b / 255);
                // }else if(y == 0){
                //     materialBottom.color.setRGB(headBottom[x][z].r / 255, headBottom[x][z].g / 255, headBottom[x][z].b / 255);
                // }
                
                // if(x == 0){
                //     cubeMaterials.forEach((material) => {
                //         material.color = new THREE.Color(0x00ff00);
                //     });
                // }
                
                if(iX <= 255){
                    iX += 1;
                }else if(iY <= 255){
                    iY += 1;
                }else{
                    iZ += 1;
                }
                
                
                const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterials)
                // cubeMesh.material.color.setRGB( 0, 0, iX / ( 8 * 8 * 8 ) );
                // iX++;
                cubeMesh.position.x = x;
                cubeMesh.position.y = y;
                cubeMesh.position.z = z;
                head.add(cubeMesh)
                //console.log("x: " + x + " y: " + y + " z: " + z);
            }
        }
    }
    scene.add(head)


    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas3D
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.render(scene, camera)

    function animate() {
        requestAnimationFrame(animate);
        head.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
};


function rotate90Clockwise(a) {

    let N = a.length;
    for (i = 0; i < parseInt(N / 2); i++) {
        for (j = i; j < N - i - 1; j++) {

            let temp = a[i][j];
            a[i][j] = a[N - 1 - j][i];
            a[N - 1 - j][i] = a[N - 1 - i][N - 1 - j];
            a[N - 1 - i][N - 1 - j] = a[j][N - 1 - i];
            a[j][N - 1 - i] = temp;
        }
    }
    return a;
}


function rotate90AntiClockwise(a) {
    
        let N = a.length;
        for (i = 0; i < parseInt(N / 2); i++) {
            for (j = i; j < N - i - 1; j++) {
    
                let temp = a[i][j];
                a[i][j] = a[j][N - 1 - i];
                a[j][N - 1 - i] = a[N - 1 - i][N - 1 - j];
                a[N - 1 - i][N - 1 - j] = a[N - 1 - j][i];
                a[N - 1 - j][i] = temp;
            }
        }
        return a;
}


function canvaToMatrix(pixels, index){
    let red = pixels[index];
    let green = pixels[index + 1];
    let blue = pixels[index + 2];
    let alpha = pixels[index + 3];

    pixels[index] = red;
    pixels[index + 1] = green;
    pixels[index + 2] = blue;

    return {r: red, g: green, b: blue};
}













