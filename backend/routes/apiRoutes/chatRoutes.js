const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const path = require("path");

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

const chatController = require("../../controllers/chatController");

router.post("/", passport.authenticate("jwt", { session: false }), chatController.accessChat);
router.get("/", passport.authenticate("jwt", { session: false }), chatController.fetchChat);
router.post(
    "/group",
    passport.authenticate("jwt", { session: false }),
    upload.single("gdp"),
    chatController.createGroupChat
);
router.put(
    "/rename_group",
    passport.authenticate("jwt", { session: false }),
    chatController.renameGroup
);
router.put(
    "/update_dp",
    passport.authenticate("jwt", { session: false }),
    upload.single("gdp"),
    chatController.updateDP
);
router.put(
    "/remove_from_group",
    passport.authenticate("jwt", { session: false }),
    chatController.removeFromGroup
);
router.put(
    "/add_to_group",
    passport.authenticate("jwt", { session: false }),
    chatController.addToGroup
);

module.exports = router;
