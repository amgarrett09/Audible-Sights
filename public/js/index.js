import {createAudioFromCanvas} from './image-conversion.js';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source");
    ctx.drawImage(image, 0, 0);
    
    const audio = createAudioFromCanvas(canvas);

    audio.initialize();

    let timeout;
    const interval = 1200 / canvas.height; // time in ms for each column
    
    const playButton = document.getElementById("play-button");
    playButton.addEventListener("click", () => {
        audio.play()

        /* loop through the columns of the image at a given interval and set 
        gains based on pixel data */
        let col = 0;
        timeout = setInterval(() => {
            if (col === canvas.height + 1) {col = 0}
            audio.setGainsFromColumn(col);
            col++
        }, interval);
    });

    const stopButton = document.getElementById("stop-button");
    stopButton.addEventListener("click", () => {
        audio.stop()
        clearTimeout(timeout);
    });

}

