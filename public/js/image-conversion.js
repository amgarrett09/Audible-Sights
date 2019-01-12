/* Takes a canvas, converts it to a 2D array of image data, and then returns
   an array of gain values and an array of pitches based on the data. */
export function getGainsAndPitches(canvas) {
    const imgData = make2dArray(canvas);
    const interval = getBaseInterval(imgData, 32);
    const gains = imgData.map(list => {
        return list.map(e => e/255);
    });
    const pitches = getPitches(imgData, interval);

    return [gains, pitches];
}

function make2dArray(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");

    if (width*height === 1) {
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        return [0.299*pixel[0] + 0.587*pixel[1] + 0.114*pixel[2]];
    }
    
    let output = Array(width).fill().map(() => Array(height));
    for (let i=0; i < width; i++) {
        for (let j=0; j < height; j++) {
            const pixel = ctx.getImageData(i, j, 1, 1).data;
            // Conversion to greyscale using CCIR 601 method
            const y = 0.299*pixel[0] + 0.587*pixel[1] + 0.114*pixel[2];
            output[i][j] = y;
        }
    }
    return output;
}

function getBaseInterval(arr, range) {
    const height = arr[0].length;
    if (height <= 1) {
        return 1;
    }
    
    const exp = 1 / height;
    return Math.pow(range, exp);
}

function getPitches(arr, baseInterval) {
    if (arr.length === 0 || arr[0].length === 0) {
        return [];
    }

    const output = Array(arr[0].length);
    let freq = 100;
    output[0] = freq;

    for (let i = 1; i < output.length; i++) {
        freq *= baseInterval;
        output[i] = freq;
    }

    return output;
}

