import {createAudioFromCanvas} from './image-conversion.js';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source");
    ctx.drawImage(image, 0, 0);
    
    const audio = createAudioFromCanvas(canvas);

    audio.initialize();

    let timeout;
    const interval = 1000 / canvas.width; // time in ms for each column
    
    const playButton = document.getElementById("play-button");
    playButton.addEventListener("click", () => {
        audio.play()

        /* loop through the columns of the canvas at a given interval and set 
        gains based on pixel data */
        let col = 0;
        let pan = -1;
        const width = canvas.width;
        timeout = setInterval(() => {
            // Used to generate a small period of silence in between loops
            const bufferBoundary = Math.floor(width*1.2)
            
            if (col >= width && col < bufferBoundary) {
                audio.setGainsToZero();
                col++;
            } else if (col === bufferBoundary) {
                col = 0;
                pan = -1;
            } else {
                audio.setPanValue(pan);
                audio.setGainsFromColumn(col);
                col++;
                pan += 2 / width;
            }
        }, interval);
    });

    const stopButton = document.getElementById("stop-button");
    stopButton.addEventListener("click", () => {
        audio.stop()
        clearTimeout(timeout);
    });
}

