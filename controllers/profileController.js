const Profile = require("../models/profile");

//getProfile

exports.getProfile = async function (req, res, next) {
    try {
        const username = req.currentUser;
        const profile = await Profile.findOne({ username: username })

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ status: 200, profile });

    } catch (error) {
        next(error);
    }
}

exports.getOtherProfile = async function (req, res, next) {
    try {
        const username = req.params.id;
        const profile = await Profile.findOne({ username: username })

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ status: 200, profile });

    } catch (error) {
        next(error);
    }
}



//editProfile

exports.editProfile = async function (req, res, next) {
    try {
        const username = req.currentUser;
        const { imageURL, bio, userLocation} = req.body;
        await Profile.findOneAndUpdate({username: username}, { imageURL, bio, userLocation});
        res.status(201).json({ status: 201, message: "Profile updateed successfully"});
    } catch (error) {
        next(error);
    }
}