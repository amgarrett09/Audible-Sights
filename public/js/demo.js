import {
    createAudioFromCanvas,
    connectPanNodeToOutput,
    setGainCtrlsToZero,
    setPanValue,
    disconnect,
    setGainCtrlsFromColumn,
    createGains
} from "./image-conversion.js";

let audioState;
let audioPlaying = false;
let timeout;

window.onload = () => {
    const canvas = document.querySelector("canvas");
    audioState = createAudioFromCanvas(canvas, 100, 6400);

    const links = document.querySelectorAll(".img-link");

    links.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();

            const image = this.firstElementChild;
            const canvas = document.querySelector("canvas");
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0);

            audioState.gainValues = createGains(canvas);

            document.querySelector(".canvas-div").setAttribute("style", "");
            document.querySelector(".audio-controls").setAttribute("style", "");
        });
    });

    // setup play and stop buttons
    const interval = 1000 / canvas.width; // time in ms for each column

    document.getElementById("play-button").addEventListener("click", () => {
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

    document.getElementById("stop-button").addEventListener("click", () => {
        if (audioPlaying === false) {
            return;
        }

        audioPlaying = false;
        disconnect(audioState.panNode, audioState.audioCtx);
        clearTimeout(timeout);
    });
};
