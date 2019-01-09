/* Takes a canvas an returns a 2D array of the canvas's image data,
   converted to greyscale for simplicity */
export function make2dArray(canvas) {
    const width = canvas.width;
    const height = canvas.height;
    const ctx = canvas.getContext("2d");

    if (width*height === 1) {
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        return [0.299*pixel[0] + 0.587*pixel[1] + 0.114*pixel[2]];
    }
    
    let output = Array(height).fill().map(() => Array(width));
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


/* Takes a 2D array and a pitch range (a number: max pitch / min pitch),
   and divides this range into a number of equal intervals based on the
   dimensions of the input array. It returns the size of the interval. */
export function getBaseInterval(arr, range) {
    const height = arr.length;
    const width = arr[0].length;

    if (width*height <= 1) {
        return 1;
    }

    const exp = 1/(width*height - 1);
    return Math.pow(range, exp);
}


/* Takes an index and a number N and returns the coordinates of the 
   ith node in an order-N Hilbert Curve. Based on Marcin Chwedczuk's solution,
   which can be found here: 
   https://marcin-chwedczuk.github.io/iterative-algorithm-for-drawing-hilbert-curve
   
   N must be a power of 2. */
function getHilbertNode(index, N) {
    if ((N === 0) || ((N & (N-1)) !== 0)) {
        throw new TypeError("N must be a power of 2");
    }
    if (index >= N*N) {
        throw new TypeError("Index must be less than N*N");
    }
    
    const positions = [
        [0, 0],
        [0, 1],
        [1, 1],
        [1, 0]
    ];

    let temp = positions[(index & 3)] // position based on last two bits of index
    let [x, y] = [temp[0], temp[1]];
    
    index = (index >>> 2);
    

    for (let n = 4; n <= N; n *= 2) {
        const n2 = n / 2;

        switch (index & 3) {
            case 0:
                temp = x; 
                x = y; 
                y = temp;
                break;
            case 1:
                x = x;
                y = y + n2;
                break;
            case 2:
                x = x + n2;
                y = y + n2;
                break;
            case 3:
                temp = y;
                y = (n2-1) - x;
                x = (n2-1) - temp;
                x = x + n2;
                break;
        }

        index = (index >>> 2);
    }
    return [x, y]; 
}


/* Takes image data and a base interval and generates an array of frequencies
   and amplitudes, where each pixel in the image gets a freq / amp pair. The
   path the algorithm traverses is a Hilbert Curve, and the distance between
   each frequency is the base interval. The amplitudes is based on the luma
   of each pixel. */
export function makeFrequencySpectrum(arr, interval) {
    const N = arr.length;

    let [x, y] = getHilbertNode(0, N);
    let freq = 50;
    let amp = arr[x][y] 
    let output = [[freq, amp]];
    for (let i=1; i < N*N; i++) {
        [x, y] = getHilbertNode(i, N);
        freq = freq*interval;
        amp = arr[x][y];
        output.push([freq, amp]);
    }

    return output;
}