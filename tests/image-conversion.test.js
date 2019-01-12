import {getPitches, getBaseInterval} from '../public/js/image-conversion';

test("Test getBaseInterval with empty 2d array", () => {
    expect(getBaseInterval([[]], 32)).toBe(1);
});
test("Test getPitches with empty array", () => {
    expect(getPitches([], 1.027)).toEqual([]);
});
test("Test getPitches with empty 2d array", () => {
    expect(getPitches([[]], 1.027)).toEqual([]);
});