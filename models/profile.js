const mongoose = require ("mongoose")

const userProfile = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    imageURL: {
        type: String,
        required: true
    },

    bio: {
        type: String,
        required: true
    },

    userLocation: {
        type: String,
        
    },

    visitedPlaces: [
        {
            // lat: {type: String},
            // long: {type: String},
            // placeName: {type: String},
            refId: { type: mongoose.Schema.Types.ObjectId, ref: "Place" },
            userRating: {type: Number}
        }
    ],

    wantToGoPlaces: [
        {
            lat: {type: Number},
            long: {type: Number}
        }
    ],

    userPosts: [
        {      refId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    }
    ]
    // this should be a way to display their previous posts, but we need a post model itself. Perhaps leave this out for now,
// and call them once the posts are generated.
    
})

module.exports = mongoose.model("Profile", userProfile)