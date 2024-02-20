const mongoose = require("mongoose")

const place = new mongoose.Schema({
    placeName: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
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