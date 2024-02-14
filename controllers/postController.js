const Post = require("../models/post");
const Profile = require("../models/profile");

exports.createPost = async function (req, res, next) {
  try {
    const { postText, postLocation, postImage} = req.body;
    
    const username = req.currentUser;
    const postDate = new Date()
    const likes = 0;
    const comments = [{}];

    const newPost = new Post({
      username,
      postDate,
      postText,
      postLocation,
      postImage,
      likes,
      comments,
    });

    await newPost.save();

    const findPostId = await Post.findOne({ _id: newPost._id });
    const newPostRef = { refId: findPostId._id }; // Set the refId to the findPostId._id;

    await Profile.findOneAndUpdate(
         { username: newPost.username }, // Modify to target the correct user
         { $push: { userPosts: newPostRef } },
         { new: true }
    );

    res.status(201).json({ status: 201, message: "Post created successfully", post: newPost });
  } catch (error) {
    next(error);
  }
};

exports.getUserPosts = async function (req, res, next) {
  try {
    const username = req.currentUser;

    const posts = await Profile.findOne({ username: username }).populate("userPosts.refId");

    if (!posts) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log(posts);

    res.json({ status: 200, posts });
  } catch (error) {
    next(error);
  }
};

exports.getAllPosts = async function (req, res, next) {
  try {
    const posts = await Post.find();
    console.log(posts)
    res.json({ status: 200, posts });
  } catch (error) {
    next(error);
  }
}

exports.updatePost = async function (req, res, next) {
  try {

    const postId = req.params.id;
    const post = await Post.findById(postId)
    const postUser = post.username

    if (req.currentUser !== postUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const update = req.body;

    const updatedPost = await Post.findByIdAndUpdate(postId, update, { new: true });

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ status: 200, message: "Post updated successfully", post: updatedPost });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async function (req, res, next) {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId)
    const postUser = post.username

    if (req.currentUser !== postUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Profile.findOneAndUpdate(
        { username: deletedPost.username }, // Modify to target the correct user
        { $pull: { userPosts: {refId: postId } } }
   );

    res.json({ status: 200, message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};
