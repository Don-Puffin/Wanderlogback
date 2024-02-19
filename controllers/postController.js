const Post = require("../models/post");
const Profile = require("../models/profile");
const Place = require("../models/place");

exports.createPost = async function (req, res, next) {
  try {
    //postLocation structure needs to be {name:,  lat:,  long:,  rating:}
    const { postText, postLocationData, postImage} = req.body;
    
    const username = req.currentUser;
    const postDate = new Date()
    const likes = 0;
    const comments = [{}];

    //check if place exists in Places
    // if not Push place to places collection
    // if exists, increment visits and calculate average rating and add
    // place to visitedPlaces and postLocation via refId
    // Check if place exists in Places
    const existingPlace = await Place.findOne({ placeName: postLocationData.name });
    let newPlace = {}

    if (!existingPlace) {
        // If place does not exist, push it to places collection
        newPlace = new Place({
            placeName: postLocationData.name,
            lat: postLocationData.lat,
            long: postLocationData.long,
            ratings: [postLocationData.rating],
            numberOfVisits: 1
        });
        await newPlace.save();
    } else {
        // If place exists, increment visits, calculate average rating, and add to visitedPlaces and postLocation via refId
        existingPlace.numberOfVisits += 1;
        existingPlace.ratings.push(postLocationData.rating);
        const totalRatings = existingPlace.ratings.reduce((acc, curr) => acc + curr, 0);
        existingPlace.avgRating = totalRatings / existingPlace.ratings.length;
        await existingPlace.save();
    }

    // Add place to visitedPlaces and postLocation via refId
    const newPlaceRefId = !existingPlace ? newPlace._id : existingPlace._id; // Assuming place exists or was just created
    const newPlaceRef = { refId: newPlaceRefId, userRating: postLocationData.rating }; // Set the refId to the existing or newly created place      

    const newPost = new Post({
      username,
      postDate,
      postText,
      postLocation: newPlaceRef,
      postImage,
      likes,
      comments,
    });

    await newPost.save();

    const findPostId = await Post.findOne({ _id: newPost._id });
    const newPostRef = { refId: findPostId._id }; // Set the refId to the findPostId._id;

    await Profile.findOneAndUpdate(
         { username: newPost.username }, // Modify to target the correct user
         { $push: { userPosts: newPostRef, visitedPlaces: newPlaceRef } },
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

    const profile = await Profile.findOne({ username: username }).
    populate({ path: "userPosts.refId", 
      populate: { 
        path: "postLocation.refId", 
        model: "Place" 
      } 
    });

    const postData = profile.userPosts;

    const posts = postData
    .map(post => {
      return {
        _id: post._id,
        username: post.refId.username,
        postDate: post.refId.postDate,
        postText: post.refId.postText,
        postLocation: post.refId.postLocation.refId.placeName,
        lat: post.refId.postLocation.refId.lat,
        lng: post.refId.postLocation.refId.long,
        rating: post.refId.postLocation.userRating,
        postImage: post.refId.postImage,
        likes: post.refId.likes,
        comments: post.refId.comments
      }
    });

    res.json({ status: 200, posts });
  } catch (error) {
    next(error);
  }
};

exports.getAllPosts = async function (req, res, next) {
  try {
    const posts = await Post.find().populate("postLocation.refId");
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
