const express = require('express')
const router = express.Router()
const {loginAdmin, updateProfile, updateProfilePicture, registerAdmin} = require('../controllers/adminController')
const {upload} = require('../middleware/uploadMiddleware')


router.post("/login", loginAdmin);
router.put("/update-profile", updateProfile);
router.put("/update-profile-picture", upload.single("profilePicture"), updateProfilePicture);
router.post("/register", registerAdmin)

module.exports = router;