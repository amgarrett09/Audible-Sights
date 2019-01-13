import {getGains, getPitches} from './image-conversion.js';

class AudioState {
    constructor(audioCtx, gains, pitches, synths, gainControllers, masterGain) {
        this.audioCtx = audioCtx;
        this.gains = gains;
        this.pitches = pitches;
        this.synths = synths;
        this.gainControllers = gainControllers;
        this .masterGain = masterGain;
    }

    initialize() {
        /* Set oscillators to correct frequencies and connect each one to a
         gain controller. */
        for (let i = 0; i < this.synths.length; i++) {
            this.synths[i].frequency.value = this.pitches[i];
            this.synths[i].connect(this.gainControllers[i]);
        }
        
        /* Initialize gain to max and connect all gain controllers to the 
        master gain */
        this.gainControllers.forEach(gain => {
            gain.gain.value = 1/128
            gain.connect(this.masterGain)
        });

        this.masterGain.gain.value = 0.5;

        this.synths.forEach(synth => synth.start(0));
    }
}

window.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const image = document.getElementById("source");
    ctx.drawImage(image, 0, 0);
    
    const audioCtx = new AudioContext();
    const gains = getGains(canvas);
    const pitches = getPitches(canvas, 100, 3200);
    const synths = pitches.map(() => audioCtx.createOscillator());
    const gainControllers = pitches.map(() => audioCtx.createGain());
    const masterGain = audioCtx.createGain();

    const audio = new AudioState(
        audioCtx, gains, pitches, synths, gainControllers, masterGain
    );

    audio.initialize();

    const playButton = document.getElementById("play-button");
    playButton.addEventListener("click", () => {
        masterGain.connect(audioCtx.destination);
    })

    const stopButton = document.getElementById("stop-button");
    stopButton.addEventListener("click", () => {
        masterGain.disconnect(audioCtx.destination);
    })

}

