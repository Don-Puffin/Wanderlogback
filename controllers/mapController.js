const Profile = require("../models/profile");
const Place = require("../models/place");

exports.getVisitedPlaces = async function (req, res, next) {
    let username = "";
    console.log("id in map function", req.params.id)
    req.params.id ? username = req.params.id : username = req.currentUser;
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

    console.log(mapLocations);

    res.json({ status: 200, mapLocations });
}

exports.topRatedPlaces = async function (req, res, next) {
    const places = await Place.find({avgRating: {$gte: 4}});
    res.json({ status: 200, places });
}