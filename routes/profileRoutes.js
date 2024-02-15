const express = require ("express")
const router = express.Router()
const {getProfile, editProfile} = require ("../controllers/profileController")
const {authUser} = require ("../middleware/authUser")

router.get ("/profile", authUser, getProfile);
router.put ("/edit", authUser, editProfile);

module.exports = router; 