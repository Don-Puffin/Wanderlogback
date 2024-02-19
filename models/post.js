const mongoose = require("mongoose")


const post = new mongoose.Schema({
    username: {type: String, required: true},   
    postDate: {type: Date, required: true},     
    postText: {type: String, required: true},
    postLocation: {
        // name: {type: String, required: true},
        // lat: {type: String, required: true},
        // long: {type: String, required: true},
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
