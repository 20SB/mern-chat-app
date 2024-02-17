const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { generateRandomString } = require("../../config/randomString");
const userController = require("../../controllers/userController");
const passport = require("passport");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         if (!fs.existsSync("public")) {
//             fs.mkdirSync("public");
//         }

//         if (!fs.existsSync("public/images")) {
//             fs.mkdirSync("public/images");
//         }

//         cb(null, "public/images");
//     },
//     filename: function (req, file, cb) {
//         var ext = path.extname(file.originalname);
//         const randomString = generateRandomString(5);
//         cb(null, Date.now() + randomString + ext);
//     },
// });

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        var ext = path.extname(file.originalname);
        if (
            ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".png" &&
            ext !== ".PNG" &&
            ext !== ".gif"
        ) {
            return cb(new Error("Only images are allowed!"));
        }

        cb(null, true);
    },
});

router.post("/signup", upload.single("dp"), userController.register);
router.post("/login", userController.login);
router.get("/", passport.authenticate("jwt", { session: false }), userController.allSearchedUsers);

module.exports = router;
