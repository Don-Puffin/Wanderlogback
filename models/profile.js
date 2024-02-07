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
        required: true
    },

    visitedPlaces: [
        {
            lat: {type: String, required: true},
            long: {type: String, required: true},
            rating: {type: Number, required: true}
        }
    ],

    wantToGoPlaces: [
        {
            lat: {type: String, required: true},
            long: {type: String, required: true}
        }
    ],
    // this should be a way to display their previous posts, but we need a post model itself. Perhaps leave this out for now,
// and call them once the posts are generated.
    
})

module.exports = mongoose.model("Profile", userProfile)