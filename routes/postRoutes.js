const express = require ("express")
const router = express.Router()
const {getPosts, createPost, deletePost, editPost, findPost} = require ("../controllers/postController")

router.get ("/posts", getPosts);
router.post ("/create", createPost);
router.delete ("/delete/:id", deletePost);
router.put ("/edit/:id", editPost);
router.get ("/find/:id", findPost)

module.exports = router; 