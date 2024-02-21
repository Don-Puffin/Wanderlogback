const express = require ("express")
const router = express.Router()
const {getProfile, editProfile, getOtherProfile} = require ("../controllers/profileController")
const {authUser} = require ("../middleware/authUser")

router.get ("/profile", authUser, getProfile);
router.get ("/otherprofile/:id", authUser, getOtherProfile);
router.put ("/edit", authUser, editProfile);

module.exports = router; 