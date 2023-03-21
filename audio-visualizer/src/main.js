/*
    main.js is primarily responsible for hooking up the UI to the rest of the application 
    and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js'
import * as audio from './audio.js'
import * as canvas from './canvas.js'
import * as sprite from './sprite.js'
import * as loader from './loader.js'

let gui;

//B - hookup play button
const playButton = document.querySelector("#play-button");

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/yeticaves.mp3"
});

const controllerObject = {};

let guiInit = () => {
    Object.freeze(controllerObject.tracks);
    /*Code referenced from dat.gui demo in myCourses and dat.gui documentation*/
    gui = new dat.GUI({ width: 650 });
    gui.close();

    let dropdownValues = {};

    //set the default track
    for(let i in controllerObject.tracks){
        dropdownValues[controllerObject.tracks[i].name] = controllerObject.tracks[i].name;
    }

    //add a dropdown menu to the datgui menu
    let trackObj = gui.add({dropdown: 'track'}, 'dropdown', dropdownValues).name("Track");

    //set a default track
    trackObj.setValue("Yeti Caves - Spelunky");
    
    //when the track is changed, load the new track
    trackObj.onChange((value) => {
        //find the track that matches the value of the dropdown menu
        let track = controllerObject.tracks.find(t => t.name == value);
        audio.loadSoundFile(track.path);

        //update play button to show that the track is paused
        playButton.dataset.playing = "no";
    });
    
    //add waveform and frequency data type dropdowns to the datgui menu
    let audioDataTypeObj = gui.add({dropdown: 'frequency'}, 'dropdown', controllerObject.nodeParams.audioDataType).name("Audio Data Type");

    //set Frequency to default
    audioDataTypeObj.setValue("Frequency");

    //onchange event for the audio data type dropdown menu
    audioDataTypeObj.onChange((value) => {
        //change boolean value of showWaveform based on the value of the dropdown menu
        if (value == "Waveform") {
            controllerObject.drawParams.showWaveform = true;
        }
        else {
            controllerObject.drawParams.showWaveform = false;
        }
    });

    //add draw params to the gui
    gui.add(controllerObject.drawParams, "showGradient").name("Show Gradient");
    gui.add(controllerObject.drawParams, "showInvert").name("Show Invert");
    gui.add(controllerObject.drawParams, "showEmboss").name("Show Emboss");

    //adds a volume slider to the datgui menu, from 1-100, sets the volume
    //of the audio to one-hundredth of the value of the slider (because the range is 0-1)
    gui.add(controllerObject.nodeParams, "volume", 0, 100).name("Volume")
        .onChange((value) => {
            audio.setVolume(value/100);
        }
    );

    //add highshelf, lowshelf, and distortion sliders to the datgui menu
    gui.add(controllerObject.nodeParams, "highshelf", -50, 50).name("Treble Boost")
        .onChange((value) => {
            audio.setHighshelf(value);
        }
    );

    gui.add(controllerObject.nodeParams, "lowshelf", -50, 50).name("Bass Boost")
        .onChange((value) => {
            audio.setLowshelf(value);
        }
    );

    //speed slider
    let speed = gui.add(controllerObject.nodeParams, "playbackSpeed", 0.1, 2).name("Speed")
        .onChange((value) => {
            audio.setSpeed(value);
        }
    ).step(0.1);

    speed.setValue(1);

    gui.add(controllerObject.drawParams, "showSphere").name("Show Sphere");

    gui.add(controllerObject.drawParams, "sphereRadius", 1, 200).name("Sphere Radius");

    gui.add(controllerObject.drawParams, "sphereSegments", 10, 100).name("Sphere Segments").step(1);


    gui.add(controllerObject.drawParams, "noiseIntensity", 0, 20).name("Noise Intensity");

    gui.add(controllerObject.drawParams, "wireframeMode").name("Wireframe Mode");

    //colors for the gradient and the sphere
    gui.addColor(controllerObject.drawParams, "primaryColor").name("Primary Color");
    gui.addColor(controllerObject.drawParams, "secondaryColor").name("Secondary Color");
}

let init = () => {
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);

    audio.setupWebaudio(DEFAULTS.sound1);

    

    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement, audio.analyzerNode);

    audio.element.addEventListener('ended', () =>{
        playButton.dataset.playing = "no";
        }
    );
    guiInit();
    loop();
}

let loop = () => {
    /* NOTE: This is temporary testing code that we will delete in Part II */
    setTimeout(loop, 1000 / 60);

    canvas.draw(controllerObject.drawParams);
}

let setupUI = (canvasElement) => {
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fs-button");

    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };

    playButton.onclick = e => {

        console.log(`audioCtx.state before = ${audio.audioCtx.state}`);

        //check if context is in suspended state (autoplay policy)
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }

        console.log(`audioCtx.state after = ${audio.audioCtx.state}`);

        if (e.target.dataset.playing == "no") {
            //if the track is currently paused, play it.
            audio.playCurrentSound();
            //set speed
            audio.setSpeed(controllerObject.nodeParams.playbackSpeed);
            e.target.dataset.playing = "yes";
        }
        else {
            //if the track is playing, pause it.
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";
        }
    }
} // end setupUI

export { init, controllerObject };