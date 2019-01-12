import {getGainsAndPitches} from './image-conversion.js';

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source");
    ctx.drawImage(image, 0, 0);

    const [gains, pitches] = getGainsAndPitches(canvas, 100, 3200);
    
    const audioCtx = new AudioContext();
    const synths = pitches.map(() => audioCtx.createOscillator());
    const gainControllers = pitches.map(() => audioCtx.createGain());
    const masterGain = audioCtx.createGain();
    
    /* Set oscillators to correct frequencies and connect each one to a
    gain controller. */
    for (let i = 0; i < synths.length; i++) {
        synths[i].frequency.value = pitches[i];
        synths[i].connect(gainControllers[i]);
    }

    gainControllers.forEach(gain => {
        gain.gain.value = 1/128
        gain.connect(masterGain)
    });

    masterGain.gain.value = 0.5;

    synths.forEach(synth => synth.start(0));

    const playButton = document.getElementById("play-button");
    playButton.addEventListener("click", () => {
        masterGain.connect(audioCtx.destination);
    })

    const stopButton = document.getElementById("stop-button");
    stopButton.addEventListener("click", () => {
        masterGain.disconnect(audioCtx.destination);
    })

}

