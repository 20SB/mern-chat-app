const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const path = require("path");

const messageController = require("../../controllers/messageController");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB file size limit
    },
});

router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    upload.array("files", 10),
    messageController.sendMessage
);
router.get("/", passport.authenticate("jwt", { session: false }), messageController.allMessage);

router.put(
    "/update",
    passport.authenticate("jwt", { session: false }),
    messageController.updateMessage
);
router.delete(
    "/unsend",
    passport.authenticate("jwt", { session: false }),
    messageController.deleteMessage
);

module.exports = router;
