const { AudioState, createGains } = require("./modules/image-conversion.js")

let audioState;

window.onload = () => {
    const canvas = document.querySelector("canvas");
    audioState = new AudioState(canvas, 100, 6400);

    const links = document.querySelectorAll(".img-link");

    /* when we click on images, draw the image on the canvas and update
    audioState */
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

    document.getElementById("play-button").addEventListener("click", () => {
        audioState.play();
    });

    document.getElementById("stop-button").addEventListener("click", () => {
        audioState.stop();
    });
};
