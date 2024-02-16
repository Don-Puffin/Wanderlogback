const express = require("express");
const router = express.Router();
const { register, login, logout, auth } = require("../controllers/authController");
const { authUser } = require("../middleware/authUser");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authUser, logout);
router.post("/auth", authUser, auth);

module.exports = router;
