const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const userController = require("../../controllers/userController");
const passport = require("passport");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
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
router.put("/update", passport.authenticate("jwt", { session: false }), userController.updateUser);
router.put(
    "/update_dp",
    passport.authenticate("jwt", { session: false }),
    upload.single("dp"),
    userController.updateDP
);
router.delete(
    "/delete",
    passport.authenticate("jwt", { session: false }),
    userController.deleteUser
);

module.exports = router;
