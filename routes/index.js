var express = require("express");
var router = express.Router();

var userModel = require("./users");
var passport = require("passport");
var localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
const upload = require("./multer");
const videoModel = require("./video");
const fs = require("fs");

router.get("/", isloggedIn, async function (req, res, next) {
  const videos = await videoModel.find();
  res.render("index", { title: "Express", videos });
});

router.get("/login", (req, res, next) => {
  res.render("login");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});

router.get(
  "/currentVideo/:videoId",
  isloggedIn,
  async function (req, res, next) {
    const currentVideo = await videoModel.findOne({
      _id: req.params.videoId,
    });
    res.render("currentVideo", { currentVideo });
  }
);

router.get("/upload", isloggedIn, (req, res, next) => {
  res.render("upload");
});

/* **************** user authentication routes ********************* */

router.post("/register", function (req, res) {
  var userData = new userModel({
    username: req.body.username,
  });
  userModel
    .register(userData, req.body.password)
    .then(function (registeredUser) {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  (req, res, next) => {}
);

router.get("/logout", (req, res, next) => {
  if (req.isAuthenticated())
    req.logout((err) => {
      if (err) res.send(err);
      else res.redirect("/");
    });
  else {
    res.redirect("/");
  }
});

function isloggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  else res.redirect("/login");
}

/* **************** user authentication routes ********************* */

/* ************** routes for video uploading ******************* */

router.post(
  "/upload",
  isloggedIn,
  upload.single("vide_file"),
  async (req, res, next) => {
    const newVideo = await videoModel.create({
      media: req.file.filename,
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
    });

    res.redirect("/");
  }
);

/* ************** routes for video uploading ******************* */
/**************** router for streaming ****************** */
router.get("/stream/:fileName", isloggedIn, async function (req, res, next) {
  fs.createReadStream(`./public/video/${req.params.fileName}`).pipe(res)
});

/**************** router for streaming ****************** */

module.exports = router;
