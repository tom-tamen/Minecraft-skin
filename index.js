
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const multiplier = 1;

let img = new Image();
img.crossOrigin = "anonymous"; // Ajouter l'attribut crossorigin
img.src = "./steve.png";

let faceDraw = document.getElementById("faceDraw");

let face = []

img.onload = function () {

    let Fwidth = img.width * multiplier;
    let Fheight = img.height * multiplier;


    canvas.width = Fwidth;
    canvas.height = Fheight;
    let tempCount = 1;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, Fwidth, Fheight);
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    for (let col = 0; col < canvas.width; col++) {
        let rowPush = [];
        for (let row = 0; row < canvas.height; row++) {
            let index = (col + row * canvas.width) * 4;
            if (col > 7 * multiplier && col < 16 * multiplier && row > 7 * multiplier && row < 16 * multiplier) {
                let red = pixels[index];
                let green = pixels[index + 1];
                let blue = pixels[index + 2];
                let alpha = pixels[index + 3];

                pixels[index] = red;
                pixels[index + 1] = green;
                pixels[index + 2] = blue;

                rowPush.push({ r: red, g: green, b: blue });

                //console.log(red, green, blue, tempCount);
                tempCount++;
            } else {
                pixels[index + 3] = 0;
            }
        }
        if (rowPush.length > 0) {
            face.push(rowPush);
        }
    }
    ctx.putImageData(imageData, 0, 0);


    face = rotate90Clockwise(face);

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
        }
    }
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