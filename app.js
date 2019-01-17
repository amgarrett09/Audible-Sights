const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();
const port = 3000;

// file uploading with multer
const multer = require("multer");
const uploadDir = path.join(__dirname, "public/images");
const fileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpe?g|png|gif)$/)) {
        return cb(new Error('Upload must be an image'), false);
    }
    cb(null, true);
}
const upload = multer({ dest: uploadDir, fileFilter: fileFilter });


// express handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setting up static files
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/upload", (req, res) => {
    res.render("upload");
});

app.get("/play-image", (req, res) => {
    res.render("play-image");
});

app.post("/play-image", upload.single('image'), (req, res) => {
    try {
        const imgPath = `/static/images/${req.file.filename}`;
        res.render("play-image", {imgPath: imgPath});
    } catch(err) {
        console.error(err);
        res.sendStatus(400);
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
