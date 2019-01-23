export function createAudioFromCanvas(canvas, minPitch, maxPitch) {
    if (minPitch == 0 || maxPitch == 0) {
        throw new Error("minPitch and maxPitch must not be zero");
    } else if (minPitch >= maxPitch) {
        throw new Error("minPitch must be less than maxPitch");
    }

    const height = canvas.height;
    const audioCtx = new AudioContext();
    const panNode = audioCtx.createStereoPanner();
    const gainValues = createGains(canvas);
    const pitches = createPitches(height, minPitch, maxPitch);
    const synths = pitches.map(() => audioCtx.createOscillator());
    const gainControllers = pitches.map(() => audioCtx.createGain());
    const masterGain = audioCtx.createGain();

    let audioState = {
        audioCtx: audioCtx,
        panNode: panNode,
        gainValues: gainValues,
        pitches: pitches,
        synths: synths,
        gainControllers: gainControllers,
        masterGain: masterGain
    };

    /* Set oscillators to correct frequencies and connect each one to a
    gain controller. */
    for (let i = 0; i < audioState.synths.length; i++) {
        audioState.synths[i].frequency.value = audioState.pitches[i];
        audioState.synths[i].connect(audioState.gainControllers[i]);
    }

    /* Initialize gain to zero and connect all gain controllers to the 
    master gain */
    audioState.gainControllers.forEach(ctrl => {
        ctrl.gain.value = 0;
        ctrl.connect(audioState.masterGain);
    });

    audioState.masterGain.gain.value = 1;

    audioState.masterGain.connect(audioState.panNode);

    audioState.synths.forEach(synth => synth.start(0));

    return audioState;
}

/* Takes a canvas and returns an array of gain values (generated from the luma
    of each pixed of the canvas). Indexes can be generated from rows and columns
    with the formula: [ROWS * column + row]*/
export function createGains(canvas) {
    const cols = canvas.width;
    const rows = canvas.height;
    const ctx = canvas.getContext("2d");

    if (cols * rows === 1) {
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        let output = [0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2]];
        return output.map(e => e / 255);
    } else if (cols * rows === 0) {
        return [];
    }

    let output = Array(cols * rows);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const pixel = ctx.getImageData(i, j, 1, 1).data;
            // Conversion to greyscale using CCIR 601 method
            const y = 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
            output[rows * i + j] = y;
        }
    }

    return output.map(e => e / 255);
}

/* Returns a list of pitches in descending order from maxPitch to minPitch.
The number of pitches is based on the height the image. */
function createPitches(height, minPitch, maxPitch) {
    let baseInterval;
    if (height <= 2) {
        baseInterval = 1;
    } else {
        const range = maxPitch / minPitch;
        const exp = 1 / (height - 1);
        baseInterval = Math.pow(range, exp);
    }

    const output = Array(height);

    let freq = maxPitch;
    output[0] = freq;

    for (let i = 1; i < output.length; i++) {
        freq /= baseInterval;
        output[i] = freq;
    }

    return output;
}
