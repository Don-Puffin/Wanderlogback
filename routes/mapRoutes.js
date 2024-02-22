const express = require ("express")
const router = express.Router()
const {getVisitedPlaces, topRatedPlaces} = require ("../controllers/mapController")
const {authUser} = require ("../middleware/authUser")

// getVisitedPlaces
router.get("/visitedPlaces/:id", authUser, getVisitedPlaces);
router.get("/topRatedPlaces", authUser, topRatedPlaces);

module.exports = router; ""