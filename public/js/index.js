import {make2dArray, getBaseInterval, makeFrequencySpectrum,} from './image-conversion.js';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source");
    ctx.drawImage(image, 0, 0);

    const imgData = make2dArray(canvas);
    const interval = getBaseInterval(imgData, 260);
    const frequencies = makeFrequencySpectrum(imgData, interval);
    console.log("done");
    console.log(frequencies);
}