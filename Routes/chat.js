const router = require("express").Router();
const chatCtrl = require("../Controller/ChatCtrl");
const auth = require("../Middlewares/auth");

router.post("/message", auth.user, chatCtrl.chat);

module.exports = router;
