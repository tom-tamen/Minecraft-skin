const customCursor = document.querySelector('#custom-cursor');


window.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';
    customCursor.style.display = 'block';
});

const img = new Image();
img.crossOrigin = "Anonymous";
img.src = 'https://mineskin.eu/skin/steve';

img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const pixelData = {
        front: [], back: [], left: [], right: [], top: [], bottom: []
    };

    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            const pixel = ctx.getImageData(x, y, 1, 1).data;
            const pixelObj = { r: pixel[0], g: pixel[1], b: pixel[2], a: pixel[3] };

            let grp = null;
            if (x >= 8 && x < 16 && y < 8) { grp = pixelData.top; }
            else if (x >= 16 && x < 24 && y < 8) { grp = pixelData.bottom; }
            else if (x >= 0 && x < 8 && y >= 8 && y < 16) { grp = pixelData.right; }
            else if (x >= 8 && x < 16 && y >= 8 && y < 16) { grp = pixelData.front; }
            else if (x >= 16 && x < 24 && y >= 8 && y < 16) { grp = pixelData.left; }
            else if (x >= 24 && x < 32 && y >= 8 && y < 16) { grp = pixelData.back; }

            if (grp) {
                if (x % 8 === 0) {
                    grp.push([pixelObj]);
                } else {
                    grp[grp.length - 1].push(pixelObj);
                }
            }
        }
    }
    const faces = Object.keys(pixelData);
    for (let i = 0; i < faces.length; i++) {
        const face = faces[i];
        const pixels = pixelData[face];

        // Créer un div pour cette face
        const faceDraw = document.createElement("div");
        faceDraw.classList.add("face");
        faceDraw.dataset.face = face;

        // Ajouter chaque pixel à la div de la face
        for (let col = 0; col < 8; col++) {
            for (let row = 0; row < 8; row++) {
                const pixel = pixels[col][row];
                const pixelDiv = document.createElement("div");
                pixelDiv.classList.add("pixel");
                pixelDiv.style.display = "block";
                pixelDiv.style.aspectRatio = "1/1";
                pixelDiv.style.backgroundColor = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
                pixelDiv.dataset.id = col + "-" + row;
                faceDraw.appendChild(pixelDiv);
            }
        }

        // Ajouter la div de la face au conteneur
        const container = document.getElementById("container");
        container.appendChild(faceDraw);
    }

    console.log(pixelData);

    pixelData.front = rotate90Clockwise(pixelData.front);
    pixelData.front.reverse();

    pixelData.left = rotate90Clockwise(pixelData.left);
    pixelData.left = rotate90Clockwise(pixelData.left);

    pixelData.right.reverse();

    pixelData.back = rotate90Clockwise(pixelData.back);

    pixelData.bottom = rotate90AntiClockwise(pixelData.bottom);

    pixelData.top = rotate90AntiClockwise(pixelData.top);

    //=======================THREE.JS=======================

    const canvas3D = document.querySelector('#render3D')

    const sizes = {
        width: 800,
        height: 600
    }

    const scene = new THREE.Scene()


    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
    camera.position.z = 20
    camera.position.y = 0
    camera.position.x = 0
    scene.add(camera)



    let head = new THREE.Group();

    let noValue = [];

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            for (let z = 0; z < 8; z++) {

                if (x == 0 || x == 7 || y == 0 || y == 7 || z == 0 || z == 7) {

                    let hasValue = [];

                    const cubeGeometry = new THREE.BoxGeometry(1.001, 1.001, 1.001)


                    let materialFront = new THREE.MeshBasicMaterial();
                    let materialBack = new THREE.MeshBasicMaterial();
                    let materialTop = new THREE.MeshBasicMaterial();
                    let materialBottom = new THREE.MeshBasicMaterial();
                    let materialRight = new THREE.MeshBasicMaterial();
                    let materialLeft = new THREE.MeshBasicMaterial();
                    let cubeMaterials = [materialRight, materialLeft, materialTop, materialBottom, materialFront, materialBack];


                    if (z == 7) {
                        materialFront.color.setRGB(pixelData.front[x][y].r / 255, pixelData.front[x][y].g / 255, pixelData.front[x][y].b / 255);
                        hasValue.push(materialFront);
                    } else if (z == 0) {
                        materialBack.color.setRGB(pixelData.back[x][y].r / 255, pixelData.back[x][y].g / 255, pixelData.back[x][y].b / 255);
                        hasValue.push(materialBack);
                    }

                    if (x == 7) {
                        materialRight.color.setRGB(pixelData.right[y][z].r / 255, pixelData.right[y][z].g / 255, pixelData.right[y][z].b / 255);
                        hasValue.push(materialRight);
                    } else if (x == 0) {
                        materialLeft.color.setRGB(pixelData.left[y][z].r / 255, pixelData.left[y][z].g / 255, pixelData.left[y][z].b / 255);
                        hasValue.push(materialLeft);
                    }

                    if (y == 7) {
                        materialTop.color.setRGB(pixelData.top[x][z].r / 255, pixelData.top[x][z].g / 255, pixelData.top[x][z].b / 255)
                        hasValue.push(materialTop);
                    } else if (y == 0) {
                        materialBottom.color.setRGB(pixelData.bottom[x][z].r / 255, pixelData.bottom[x][z].g / 255, pixelData.bottom[x][z].b / 255)
                        hasValue.push(materialBottom);
                    }

                    cubeMaterials.forEach((material) => {
                        if (!hasValue.includes(material)) {
                            noValue.push(material);
                        }
                    });


                    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterials)

                    cubeMesh.position.x = x;
                    cubeMesh.position.y = y;
                    cubeMesh.position.z = z;

                    cubeMesh.userData.id = x + '-' + y + '-' + z;
                    cubeMesh.userData.isCube = true

                    //head.add(cubeMesh)
                    head.add(cubeMesh)

                }

            }
        }
    }
    head.rotateX(Math.PI);
    head.rotateY(Math.PI);
    head.scale.y = -1;
    head.position.x = 2;
    head.position.y = -2;
    head.position.z = 0;

    let pivot = new THREE.Group();
    pivot.add(head);
    scene.add(pivot);


    // Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas3D
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.render(scene, camera)


    const cursor = {
        x: 0,
        y: 0
    }

    let rbgCounter = 0;
    let rbgCounterOld = 0;
    let rgbTimer = setInterval(function () {
        
    }, 100)

    let rgb = {red:{
        v:Math.floor(Math.random() * 256),
        reset : false
    }, green : {
        v:Math.floor(Math.random() * 256),
        reset : false
    }, blue : {
        v:Math.floor(Math.random() * 256),
        reset : false
    }};

    let time = Date.now();

    function animate() {
        requestAnimationFrame(animate);
        //head.rotation.y += 0.005;
        let now = Date.now();
        let deltaT = now - time;
        time = now;
        pivot.rotation.y += deltaT * 0.001;

        //head.rotation.x += 0.01;
        //camera.position.x = cursor.x * 10
        //camera.position.y = cursor.y * 10
        camera.lookAt(pivot.position);
        renderer.render(scene, camera);


        // console.log(r,g,b);
        // noValue.forEach((material) => {
        //     material.color.setRGB(rgb.red.v/255, rgb.green.v/255, rgb.blue.v/255);
        // });


        for (let i = 0; i < head.children.length; i++) {
            if (head.children[i].userData.hasHover) {
                if (head.children[i].scale.x > 0.5) {
                    head.children[i].scale.x -= 0.01;
                    head.children[i].scale.y -= 0.01;
                    head.children[i].scale.z -= 0.01;
                    if (head.children[i].scale.x <= 0.5) {
                        head.children[i].scale.x = 0.5;
                        head.children[i].scale.y = 0.5;
                        head.children[i].scale.z = 0.5;
                        head.children[i].userData.hasHover = false;
                        head.children[i].userData.restore = true;
                    }
                }
            }
            if (head.children[i].userData.restore) {
                if (head.children[i].scale.x < 1) {
                    head.children[i].scale.x += 0.01;
                    head.children[i].scale.y += 0.01;
                    head.children[i].scale.z += 0.01;
                    if (head.children[i].scale.x >= 0.99) {
                        head.children[i].scale.x = 1.001;
                        head.children[i].scale.y = 1.001;
                        head.children[i].scale.z = 1.001;
                        head.children[i].userData.restore = false;
                    }
                }
            }
        }
    }

    animate();

    canvas3D.addEventListener('mousemove', onMouseMove);

    function onMouseMove(event) {
        // Obtenir les coordonnées de la souris

        const rect = renderer.domElement.getBoundingClientRect();
        cursor.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
        cursor.y = - ((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;


        // Lancer un rayon depuis la caméra
        const raycaster = new THREE.Raycaster()
        raycaster.setFromCamera(new THREE.Vector2(cursor.x, cursor.y), camera)

        // Trouver tous les objets intersectés par le rayon
        const intersects = raycaster.intersectObjects(scene.children, true)

        // Parcourir les intersections pour trouver les cubes intersectés
        for (const intersect of intersects) {
            if (intersect.object.userData.isCube) {
                // Le cube a été survolé par la souris
                //console.log('Cube survolé:', intersect.object.userData.id)
                if (!intersect.object.userData.restore) {
                    intersect.object.userData.hasHover = true;
                }
            }
        }
    }
}


function rotate90Clockwise(matrix) {

    let N = matrix.length;
    for (i = 0; i < parseInt(N / 2); i++) {
        for (j = i; j < N - i - 1; j++) {

            let temp = matrix[i][j];
            matrix[i][j] = matrix[N - 1 - j][i];
            matrix[N - 1 - j][i] = matrix[N - 1 - i][N - 1 - j];
            matrix[N - 1 - i][N - 1 - j] = matrix[j][N - 1 - i];
            matrix[j][N - 1 - i] = temp;
        }
    }
    return matrix;
}


function rotate90AntiClockwise(matrix) {

    let N = matrix.length;
    for (i = 0; i < parseInt(N / 2); i++) {
        for (j = i; j < N - i - 1; j++) {

            let temp = matrix[i][j];
            matrix[i][j] = matrix[j][N - 1 - i];
            matrix[j][N - 1 - i] = matrix[N - 1 - i][N - 1 - j];
            matrix[N - 1 - i][N - 1 - j] = matrix[N - 1 - j][i];
            matrix[N - 1 - j][i] = temp;
        }
    }
    return matrix;
}