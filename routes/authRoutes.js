const express = require("express");
const router = express.Router();
const { register, login, test } = require("../controllers/authController");
const {getAllPosts, createPost, deletePost, updatePost, getUserPosts} = require ("../controllers/postController")
const { authUser } = require("../middleware/authUser");

router.post("/register", register);
router.post("/login", login);

router.post("/test", authUser, test);

module.exports = router;
