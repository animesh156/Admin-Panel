const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Admin = require('../models/adminModel')

// Generate JWT
const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // Store token in HTTP-only cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
};




// @desc Login a new uer
// @route POST /auth/login
// @access Public
const loginAdmin = async (req,res) => {
   
    const {email, password} = req.body;
    const admin = await Admin.findOne({email})
 
    if(user && (await bcrypt.compare(password, admin.password))) {
     generateToken(res, user._id);
     res.json({
         _id: admin._id,
         name: admin.name,
         email: admin.email,
         role: admin.role
     });
    } else {
     return res.status(400).json({error: "Invalid credentials"})
    }
 }


 // Update Profile
  const updateProfile = async (req, res) => {
    const { name } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(req.admin.id, { name }, { new: true });
  
    res.json({ message: "Profile updated", admin: updatedAdmin });
  };
  
  // Update Profile Picture
   const updateProfilePicture = async (req, res) => {
    try {
        const profilePictureUrl = req.file.path;
        const updatedAdmin = await Admin.findByIdAndUpdate(
          req.admin.id,
          { profilePicture: profilePictureUrl },
          { new: true }
        );
    
        res.json({ message: "Profile picture updated successfully", admin: updatedAdmin });
      } catch (error) {
        res.status(500).json({ message: "Error updating profile picture", error: error.message });
      }
  };



  // @desc Register admin(1 time only )
// @route POST /auth/register(temporary route)
// @access private
const registerAdmin = async (req,res) => {
    
    const {name,email, password, profilePicture} = req.body;

    

    if(!name || !email || !password){
        return res.status(400).json({error: "Please provide all required fields"})
    }


    const adminExists = await Admin.findOne({email})

    if(adminExists){
        return res.status(400).json({error: "Admin already exist"})
    }
    

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
     
    const admin = await Admin.create({
        name,
        email,
        password: hashedPassword,
       profilePicture
    })

    if(admin) {
        generateToken(res, admin._id);
        res.status(201).json({
            Id: admin._id,
            name: admin.name,
            email: admin.email,
        });
    } else {
        res.status(400).json("Invalid user data")
    }

}





 

 module.exports = {
    loginAdmin,
    updateProfile,
    updateProfilePicture,
    registerAdmin
 }