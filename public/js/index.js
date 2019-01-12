import {getGainsAndPitches} from './image-conversion.js';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source");
    ctx.drawImage(image, 0, 0);

    const [gains, pitches] = getGainsAndPitches(canvas);
    console.log(gains);
    console.log(pitches);
    
}

