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

test('Get the 7th node of an order 4 Hilber Curve', () => {
    expect(getHilbertNode(7, 4)).toEqual([1,2]);
});
test('Get the 13th node of an order 4 Hilber Curve', () => {
    expect(getHilbertNode(13, 4)).toEqual([2,1]);
});
test('Get the 2nd node of an order 2 Hilber Curve', () => {
    expect(getHilbertNode(2, 2)).toEqual([1,1]);
});
test('Get the 55th node of an order 8 Hilber Curve', () => {
    expect(getHilbertNode(55, 8)).toEqual([5,2]);
});
test('Get the 8th node of an order 8 Hilber Curve', () => {
    expect(getHilbertNode(8, 8)).toEqual([2,2]);
});
test('Get the 15th node of an order 8 Hilber Curve', () => {
    expect(getHilbertNode(15, 8)).toEqual([0,3]);
});
test('Get the 1st node of an order 8 Hilber Curve', () => {
    expect(getHilbertNode(1, 8)).toEqual([0,1]);
});