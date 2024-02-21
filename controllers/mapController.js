const Profile = require("../models/profile");
const Place = require("../models/place");

exports.getVisitedPlaces = async function (req, res, next) {
    const username = req.currentUser;
    const profile = await Profile.findOne({ username: username }).populate("visitedPlaces.refId");
    const places = profile.visitedPlaces;

    if (!places) {
        return res.status(404).json({ message: "Places not found" });
    }
    
    const mapLocations = places.map(place => {
        return {
            name: place.refId.placeName,
            lat: place.refId.lat,
            lng: place.refId.long,
            rating: place.userRating
        }
    })

    res.json({ status: 200, mapLocations });
}

exports.topRatedPlaces = async function (req, res, next) {
    const places = await Place.find({avgRating: {$gte: 4}});
    res.json({ status: 200, places });
}