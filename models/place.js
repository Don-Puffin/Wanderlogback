const mongoose = require("mongoose")

const place = new mongoose.Schema({
    placeName: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    },
    long: {
        type: String,
        required: true
    },
    avgRating: {
        type: Number
    },
    ratings: [{
        type: Number,
    }],
    numberOfVisits: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("Place", place)