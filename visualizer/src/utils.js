const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};

const average = (arr) => {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum / arr.length;
}

const scale = (audioData) => {
    let amplitudeRatio = 1 + average(audioData) / 255;
    let minValue = 1;
    let maxValue = Math.max(5, 1 + (Math.max(...audioData) / 150));
    return 1 + (minValue + (maxValue - minValue) * Math.pow(amplitudeRatio, 7)) / 25;
}

const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor, 255 - floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx, startX, startY, endX, endY, colorStops) => {
    let lg = ctx.createLinearGradient(startX, startY, endX, endY);
    for (let stop of colorStops) {
        lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
};

// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};

export { makeColor, getRandomColor, getLinearGradient, goFullscreen, average, scale };