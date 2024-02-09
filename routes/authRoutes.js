const express = require("express");
const router = express.Router();
const { register, login, test} = require("../controllers/authController");
const { authUser } = require("../middleware/authUser");

router.post("/register", register);
router.post("/login", login);
router.post("/test", authUser, test);

module.exports = router;
