const express = require("express");
const router = express.Router();
const passport = require("passport");

const chatController = require("../../controllers/chatController");

router.post('/', passport.authenticate('jwt', {session: false}), chatController.accessChat);
router.get('/', passport.authenticate('jwt', {session: false}), chatController.fetchChat);
router.post('/group', passport.authenticate('jwt', {session:false}), chatController.createGroupChat);
router.put('/rename_group', passport.authenticate('jwt', {session: false}), chatController.renameGroup);
router.put('/remove_from_group', passport.authenticate('jwt', {session: false}), chatController.removeFromGroup);
router.put('/add_to_group', passport.authenticate('jwt', {session: false}), chatController.addToGroup);

module.exports = router;