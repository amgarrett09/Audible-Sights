import { createAudioFromCanvas } from "./image-conversion.js";

let audioPlaying = false;
let audioState;
let timeout;

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source");
    ctx.drawImage(image, 0, 0);

    audioState = createAudioFromCanvas(canvas, 100, 6400);

    // setup play and stop buttons
    const interval = 1000 / canvas.width; // time in ms for each column

    document.getElementById("play-button").addEventListener("click", () => {
        if (audioPlaying === true) {
            return;
        }

        audioPlaying = true;

        // start playing audio
        audioState.panNode.connect(audioState.audioCtx.destination);

        /* loop through each column of the gainValue data at a given interval
        and set gainControllers accordingly */
        let col = 0;
        let pan = -1;
        const width = canvas.width;
        const bufferBoundary = Math.floor(width * 1.2);

        timeout = setInterval(() => {
            if (col === width) {
                audioState.gainControllers.forEach(
                    ctrl => (ctrl.gain.value = 0)
                );
            } else if (col === bufferBoundary) {
                pan = -1;
            } else if (col < width) {
                audioState.panNode.pan.value = pan;

                // set gain controllers based on current column
                const rows = audioState.gainControllers.length;
                for (let i = 0; i < rows; i++) {
                    audioState.gainControllers[i].gain.value =
                        audioState.gainValues[rows * col + i] / rows;
                }

                pan += 2 / width;
            }

            col = (col + 1) % (bufferBoundary + 1);
        }, interval);
    });

    document.getElementById("stop-button").addEventListener("click", () => {
        if (audioPlaying === false) {
            return;
        }

        audioPlaying = false;
        audioState.panNode.disconnect(audioState.audioCtx.destination);
        clearTimeout(timeout);
    });
};
