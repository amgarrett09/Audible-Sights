import {makeFrequencySpectrum,} from './image-conversion.js';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source");
    ctx.drawImage(image, 0, 0);

    const frequencies = makeFrequencySpectrum(canvas);
    console.log("done");
    console.log(frequencies);
}