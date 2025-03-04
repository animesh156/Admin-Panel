const express = require("express");
const router = express.Router();
const {
  loginAdmin,
  registerAdmin,
  logoutUser,
  updateProfile,
  updateProfilePicture 
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");


router.post("/login", loginAdmin);
router.put("/update-profile",protect, updateProfile);
router.put("/update-profile-picture",protect, updateProfilePicture);
router.post("/register", registerAdmin);
router.post("/logout",protect, logoutUser);

module.exports = router;
