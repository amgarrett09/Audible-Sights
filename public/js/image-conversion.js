class AudioState {
    constructor(
        audioCtx,
        gains,
        pitches,
        synths,
        gainControllers,
        masterGain,
        panNode
    ) {
        this.audioCtx = audioCtx;
        this.gains = gains;
        this.pitches = pitches;
        this.synths = synths;
        this.gainControllers = gainControllers;
        this.masterGain = masterGain;
        this.panNode = panNode;
    }

    initialize() {
        /* Set oscillators to correct frequencies and connect each one to a
         gain controller. */
        for (let i = 0; i < this.synths.length; i++) {
            this.synths[i].frequency.value = this.pitches[i];
            this.synths[i].connect(this.gainControllers[i]);
        }

        /* Initialize gain to zero and connect all gain controllers to the 
        master gain */
        this.gainControllers.forEach(ctrl => {
            ctrl.gain.value = 0;
            ctrl.connect(this.masterGain);
        });

        this.masterGain.gain.value = 0.5;

        this.masterGain.connect(this.panNode);

        this.synths.forEach(synth => synth.start(0));
    }

    play() {
        this.panNode.connect(this.audioCtx.destination);
    }

    stop() {
        this.panNode.disconnect(this.audioCtx.destination);
    }

    // loop through a column of the gain data and set the gain controllers accordingly
    setGainsFromColumn(col) {
        const rows = this.gainControllers.length;
        for (let i = 0; i < rows; i++) {
            this.gainControllers[i].gain.value =
                this.gains[rows * col + i] / rows;
        }
    }

    setGainsToZero() {
        this.gainControllers.forEach(ctrl => (ctrl.gain.value = 0));
    }

    setPanValue(num) {
        this.panNode.pan.value = num;
    }
}

export function createAudioFromCanvas(canvas, minPitch, maxPitch) {
    if (minPitch == 0 || maxPitch == 0) {
        throw new Error("minPitch and maxPitch must not be zero");
    } else if (minPitch >= maxPitch) {
        throw new Error("minPitch must be less than maxPitch");
    }

    const height = canvas.height;
    const audioCtx = new AudioContext();
    const panNode = audioCtx.createStereoPanner();
    const gains = createGains(canvas);
    const pitches = createPitches(height, minPitch, maxPitch);
    const synths = pitches.map(() => audioCtx.createOscillator());
    const gainControllers = pitches.map(() => audioCtx.createGain());
    const masterGain = audioCtx.createGain();

    return new AudioState(
        audioCtx,
        gains,
        pitches,
        synths,
        gainControllers,
        masterGain,
        panNode
    );
}

/* Takes a canvas and returns an array of gain values (generated from the luma
    of each pixed of the canvas). Indexes can be generated from rows and columns
    with the formula: [ROWS * column + row]*/
function createGains(canvas) {
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