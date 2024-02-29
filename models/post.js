const mongoose = require("mongoose")


const post = new mongoose.Schema({
    username: {type: String, required: true},
    userImageURL: {type: String, required: true},   
    postDate: {type: Date, required: true},     
    postText: {type: String, required: true},
    postLocation: {
        refId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
        userRating: {type: Number}
    },
    postImage: {type: String, required: true},
    likes: {type: Number, required: true},
    comments: [
        {
            username: {type: String},
            commentText: {type: String}
        }
    ]
})

module.exports = mongoose.model("Post", post)
