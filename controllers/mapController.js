const Profile = require("../models/profile");
const Place = require("../models/place");

exports.getVisitedPlaces = async function (req, res, next) {
    let username = "";
    if (req.params.id !== null && req.params.id !== "null") {
        username = req.params.id
    } else {
        username = req.currentUser;
    }
    const profile = await Profile.findOne({ username: username }).populate("visitedPlaces.refId");
    let places = [{}]

    if (profile?.visitedPlaces) {
        places = profile.visitedPlaces;
    } else {
        places = [];
    }
    
    let mapLocations = []

    if (places.length > 0) {
        mapLocations = places.map(place => {
            return {
                name: place.refId.placeName,
                lat: place.refId.lat,
                lng: place.refId.long,
                rating: place.userRating
            }
        })
    }

    res.json({ status: 200, mapLocations });
}

exports.topRatedPlaces = async function (req, res, next) {
    const places = await Place.find({avgRating: {$gte: 4}});
    let mapLocations = []

    if (places.length > 0) {
        mapLocations = places.map(place => {
            return {
                name: place.placeName,
                lat: place.lat,
                lng: place.long,
                rating: place.avgRating
            }
        })
    }

    res.json({ status: 200, mapLocations });
}