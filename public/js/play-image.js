import {
    createAudioFromCanvas,
    connectPanNodeToOutput,
    setGainCtrlsToZero,
    setPanValue,
    disconnect,
    setGainCtrlsFromColumn,
} from "./image-conversion.js";

let audioPlaying = false;
let audioState;

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source");
    ctx.drawImage(image, 0, 0);

    audioState = createAudioFromCanvas(canvas, 100, 6400);

    let timeout;
    const interval = 1000 / canvas.width; // time in ms for each column

    const playButton = document.getElementById("play-button");
    playButton.addEventListener("click", () => {
        if (audioPlaying === true) {
            return;
        }

        audioPlaying = true;
        connectPanNodeToOutput(audioState.panNode, audioState.audioCtx);

        /* loop through the columns of the canvas at a given interval and set 
        gains based on pixel data */
        let col = 0;
        let pan = -1;
        const width = canvas.width;
        // Used to generate a small period of silence in between loops
        const bufferBoundary = Math.floor(width * 1.2);

        timeout = setInterval(() => {
            if (col === width) {
                setGainCtrlsToZero(audioState.gainControllers);
            } else if (col === bufferBoundary) {
                pan = -1;
            } else if (col < width) {
                setPanValue(audioState.panNode, pan);
                setGainCtrlsFromColumn(
                    audioState.gainValues,
                    audioState.gainControllers,
                    col
                );
                pan += 2 / width;
            }

            col = (col + 1) % (bufferBoundary + 1);
        }, interval);
    });

    const stopButton = document.getElementById("stop-button");
    stopButton.addEventListener("click", () => {
        if (audioPlaying === false) {
            return;
        }

        audioPlaying = false;
        disconnect(audioState.panNode, audioState.audioCtx);
        clearTimeout(timeout);
    });
};
