const express = require("express");
const router = express.Router();
const { register, login, authUser } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/auth", authUser);

module.exports = router;
