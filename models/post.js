const mongoose = require("mongoose")


const post = new mongoose.Schema({
    username: {type: String, required: true},   
    postDate: {type: Date, required: true},     
    postText: {type: String, required: true},
    postLocation: {type: String, required: true},
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
