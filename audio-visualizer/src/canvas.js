/*
    The purpose of this file is to take in the analyser node and a <canvas> element: 
      - the module will create a drawing context that points at the <canvas> 
      - it will store the reference to the analyser node
      - in draw(), it will loop through the data in the analyser node
      - and then draw something representative on the canvas
      - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyzerNode, audioData;

let horizontalRotation = 0;
let noiseRotation = 0;
let scale;
let rotationSpeed;

//cache arrays
let latCache = [];
let longCache = [];

let prevLong = 10
let prevLat = 10
let prevRadius = 10;

let isoAngle = Math.atan(Math.SQRT1_2);

let simplex = new SimplexNoise();

let setupCanvas = (canvasElement, analyzerNodeRef) => {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    // create a gradient that runs top to bottom
    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: .25, color: "green" }, { percent: 1.0, color: "black" }]);
    // keep a reference to the analyser node
    analyzerNode = analyzerNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyzerNode.fftSize / 2);
    computeCache(prevRadius, prevLat, prevLong);
    updateRotateValues();
}

let computeCache = (radius, numLat, numLong) => {
    //compute the latitude cache
    for (let i = 0; i < numLat + 1; i++) {
        let latitude = Math.PI * (-0.5 + (i / numLat));
        let y = radius * Math.sin(latitude);
        let xz = radius * Math.cos(latitude);
        let prevLat = Math.PI * (-0.5 + ((i - 1) / numLat));
        let prevY = radius * Math.sin(prevLat);
        let prevXZ = radius * Math.cos(prevLat);

        latCache[i] = {
            latitude: latitude,
            y: y,
            xz: xz,
            prevY: prevY,
            prevXZ: prevXZ,
            prevLat: prevLat
        }

        //compute the longitude cache
        for (let j = 0; j <= numLong; j++) {
            let longitude = 2 * Math.PI * (j / numLong);

            //reusing computations to save some performance
            const sinIsoAngle = Math.sin(isoAngle);
            const cosIsoAngle = Math.cos(isoAngle);

            let x = latCache[i].xz * Math.cos(longitude);
            let z = latCache[i].xz * Math.sin(longitude);

            let isoX = (x - z) * cosIsoAngle;
            let isoY = (x + z) * sinIsoAngle - latCache[i].y;

            longCache[j] = {
                longitude: longitude,
                sinIsoAngle: sinIsoAngle,
                cosIsoAngle: cosIsoAngle,
                isoX : isoX,
                isoY: isoY,
            }
        }

    }



}

let updateRotateValues = () => {
    setTimeout(updateRotateValues, 1000 / 120);
    scale = utils.scale(audioData);
    rotationSpeed = scale;
    horizontalRotation += rotationSpeed / 100;
    noiseRotation += utils.average(audioData) / 10;
}

let drawSphere = (xPos, yPos, radius, numLat, numLong, noiseIntensity, strokeStyle = "black", fillStyle = "green", lineWidth = "1") => {
    
    for (let i = 0; i < numLat + 1; i++) {
        //computes points for the latitudinal points of the sphere, takes values from cache to save performance.
        for (let j = 0; j <= numLong; j++) {
            let x = latCache[i].xz * Math.cos(longCache[j].longitude);
            let z = latCache[i].xz * Math.sin(longCache[j].longitude);
            let isoX = (x - z) * Math.cos(isoAngle);
            let isoY = (x + z) * Math.sin(isoAngle) - latCache[i].y;
            //applies noise to the latitudinal points of the sphere
            const noise = simplex.noise3D(isoX * 0.01,
                isoY * 0.01,
                noiseRotation * 0.01);

            isoX += noise * noiseIntensity * scale * utils.average(audioData) / 255;
            isoY += noise * noiseIntensity * scale * utils.average(audioData) / 255;

            if (j == 0) {
                //connects latitudinal points and draws them to the canvas.
                ctx.save();
                ctx.beginPath();

                ctx.lineWidth = lineWidth;
                ctx.fillStyle = fillStyle;
                ctx.strokeStyle = strokeStyle;

                ctx.translate(xPos, yPos);
                ctx.scale(scale, scale);
                ctx.moveTo(isoX, isoY);


            }
            else {
                ctx.lineTo(isoX, isoY);
            }
        }

        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        ctx.restore();


        // Compute values for longitudinal points on the sphere
        if (i > 0) {
            for (let k = 0; k < numLong; k++) {
                const longitude = longCache[k].longitude;
                let x1 = latCache[i].prevXZ * Math.sin(longitude + horizontalRotation);
                let z1 = latCache[i].prevXZ * Math.cos(longitude + horizontalRotation);

                let isoX1 = (x1 - z1) * longCache[k].cosIsoAngle;
                let isoY1 = (x1 + z1) * longCache[k].sinIsoAngle - latCache[i].prevY;

                let x2 = latCache[i].xz * Math.sin(longitude + horizontalRotation);
                let z2 = latCache[i].xz * Math.cos(longitude + horizontalRotation);

                let isoX2 = (x2 - z2) * longCache[k].cosIsoAngle;
                let isoY2 = (x2 + z2) * longCache[k].sinIsoAngle - latCache[i].y;

                //applies 3d perlin noise to the beginning and end of the isometric line segments
                const noise = simplex.noise3D(isoX1 * 0.01,
                    isoY1 * 0.01,
                    noiseRotation * 0.01);

                const noise2 = simplex.noise3D(isoX2 * 0.01,
                    isoY2 * 0.01,
                    noiseRotation * 0.01);

                const noiseIntensityScale = noise * noiseIntensity * scale
                const noiseIntensityScale2 = noise2 * noiseIntensity * scale

                isoX1 = isoX1 + noiseIntensityScale * utils.average(audioData) / 255;
                isoY1 = isoY1 + noiseIntensityScale * utils.average(audioData) / 255;
                isoX2 = isoX2 + noiseIntensityScale2 * utils.average(audioData) / 255;
                isoY2 = isoY2 + noiseIntensityScale2 * utils.average(audioData) / 255; 

                //connect longitudinal points and draw the line to the canvas.
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = strokeStyle;
                ctx.translate(xPos, yPos);
                ctx.scale(scale, scale);
                ctx.moveTo(isoX1, isoY1);
                ctx.lineTo(isoX2, isoY2);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}

let draw = (params = {}) => {
    if (prevLat != params.sphereSegments || prevLong != params.sphereSegments || prevRadius != params.sphereRadius) {
        computeCache(params.sphereRadius, params.sphereSegments, params.sphereSegments);
        prevLat = params.sphereSegments;
        prevLong = params.sphereSegments;
        prevRadius = params.sphereRadius;
    }

    gradient = utils.getLinearGradient(ctx, 0, 0, 0, canvasHeight, [{ percent: .25, color: params.primaryColor }, { percent: 1.0, color: params.secondaryColor }]);
    // 1 - populate the audioData array with the frequency data from the analyserNode
    // notice these arrays are passed "by reference" 

    if (!params.showWaveform) analyzerNode.getByteFrequencyData(audioData);
    else analyzerNode.getByteTimeDomainData(audioData); // waveform data

    // 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // 3 - draw gradient
    if (params.showGradient) {
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
    }

    if (params.images) {
        for (let sprite of params.images) {
            sprite.update(audioData);
            sprite.draw(ctx);
        }
    }

    let fillstyle;

    if(!params.wireframeMode){
        fillstyle = params.primaryColor;
    }
    else{
        fillstyle = "transparent";
    }

    if (params.showSphere) drawSphere(canvasWidth / 2, canvasHeight / 2, params.sphereRadius, params.sphereSegments, params.sphereSegments, params.noiseIntensity,
        params.secondaryColor, fillstyle, 1);

    // 6 - bitmap manipulation
    // A) grab all of the pixels on the canvas and put them in the `data` array
    // `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
    // the variable `data` below is a reference to that array 
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for (let i = 0; i < length; i += 4) {
        // C) randomly change every 20th pixel to red
        if (params.showNoise && Math.random() < .05) {
            // data[i] is the red channel
            // data[i+1] is the green channel
            // data[i+2] is the blue channel
            // d ata[i+3] is the alpha channel
            // zero out the red and green and blue channels
            // make the red channel 100% red

            data[i] = data[i + 1] = data[i + 2] = 0;
            data[1] = 255;
        } // end if

        if (params.showInvert) {
            let red = data[i], green = data[i + 1], blue = data[i + 2];
            data[i] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;
        } //end if
    } // end for   

    if (params.showEmboss) {
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) continue;//skip alpha
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }

    // D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);
}

export { setupCanvas, draw };