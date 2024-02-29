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
    
})

module.exports = mongoose.model("Profile", userProfile)