const router = require("express").Router();
const userCtrl = require("../Controller/UserCtrl");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
router.post("/forgot-password", userCtrl.forgotPassword);
router.patch("/reset-password", userCtrl.resetPassword);

module.exports = router;
