const { AudioState } = require("./modules/image-conversion.js");

// Change page title
document.querySelector("title").innerText =
    "Audible Sights - Play Uploaded Image";

let audioState;

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source");
    ctx.drawImage(image, 0, 0);

    audioState = new AudioState(canvas, 100, 6400);

    document.getElementById("play-button").addEventListener("click", () => {
        audioState.play();
    });

    document.getElementById("stop-button").addEventListener("click", () => {
        audioState.stop();
    });
};
