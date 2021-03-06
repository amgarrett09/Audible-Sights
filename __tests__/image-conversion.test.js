const { createGains, createPitches } = require("../src/js/modules/image-conversion.js");
const { createCanvas, loadImage } = require("canvas");

test("test createGains function", async () => {
    const canvas = createCanvas(2, 2);
    const ctx = canvas.getContext("2d");
    const image = await loadImage("public/images/demo/building.png");
    ctx.drawImage(image, 0, 0);

    expect(createGains(canvas)).toEqual([
        0.976470588235294,
        0.976470588235294,
        0.9725490196078431,
        0.9725490196078431
    ]);
});

test("test createPitches function", () => {
    expect(createPitches(4, 100, 6400)).toEqual([
        6400,
        1600.0000000000002,
        400.0000000000001,
        100.00000000000004
    ]);
});
