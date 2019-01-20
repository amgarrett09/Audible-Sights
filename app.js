const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// file uploading with multer
const multer = require("multer");
const uploadDir = path.join(__dirname, "public/images");
const fileFilter = (req, file, cb) => {
    if (
        !file.originalname.match(/\.(jpe?g|png|gif)$/) ||
        (file.originalname.match(/\./g) || []).length > 1 // if we find more than one '.'
    ) {
        return cb(new Error("Upload must be an image"), false);
    }
    cb(null, true);
};
const upload = multer({
    dest: uploadDir,
    limits: { fileSize: 15360 },
    fileFilter: fileFilter
});
const uploadSingleImage = upload.single("image");

// body parser
const parseBody = bodyParser.urlencoded({ extended: false });

// CSRF protection
const csrfMiddleware = csurf({ cookie: true });
app.use(cookieParser());

// express handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setting up static files
app.use("/static", express.static(path.join(__dirname, "public")));

// routes
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/upload", csrfMiddleware, (req, res) => {
    let err;
    switch (req.query.error) {
        case "badimage":
            err =
                "Please upload an image file (jpg, png, or gif) that's less than 15KB.";
            break;
        default:
            err = false;
            break;
    }
    res.render("upload", { csrfToken: req.csrfToken(), err: err });
});

app.get("/play-image", (req, res) => {
    const fileName = req.query.img;
    const time = req.query.time;
    res.render("play-image", { fileName: fileName });
});

app.post("/play-image", parseBody, csrfMiddleware, (req, res) => {
    uploadSingleImage(req, res, err => {
        if (err || !req.file) {
            res.redirect("/upload?error=badimage");
            return;
        }

        const fileName = req.file.filename;
        res.redirect(`/play-image?img=${fileName}`);
    });
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

// error handler
app.use(function(err, req, res, next) {
    if (err.code !== "EBADCSRFTOKEN") return next(err);

    res.status(403);
    res.send("403: Forbidden");
});
