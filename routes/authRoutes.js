const express = require("express");
const router = express.Router();
const { register, login, logout, test } = require("../controllers/authController");
const { authUser } = require("../middleware/authUser");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authUser, logout);

router.post("/test", authUser, test);

module.exports = router;
