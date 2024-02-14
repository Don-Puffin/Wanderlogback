const express = require ("express")
const router = express.Router()
const {getAllPosts, createPost, deletePost, updatePost, getUserPosts} = require ("../controllers/postController")
const {authUser} = require ("../middleware/authUser")

router.get ("/posts", authUser, getAllPosts);
router.post ("/create", authUser, createPost);
router.delete ("/delete/:id", authUser, deletePost);
router.put ("/update/:id", authUser, updatePost);
router.get ("/userPosts", authUser, getUserPosts)

module.exports = router; 