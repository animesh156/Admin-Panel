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

// @desc Register a new uer
// @route POST /auth/register
// @access Public
const registerAdmin = async (req,res) => {
    
    const {name,email, password,profilePicture} = req.body;

    

    if(!name || !email || !password){
        return res.status(400).json({error: "Please provide all required fields"})
    }


    const userExists = await Admin.findOne({email})

    if(userExists){
        return res.status(400).json({error: "User already exist"})
    }
    

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt)
     
    const user = await Admin.create({
        name,
        email,
        password: hashedPassword,
       profilePicture
    })

    if(user) {
        generateToken(res, user._id);
        res.status(201).json({
            Id: user._id,
            name: user.name,
            email: user.email,
          profilePic: profilePicture

        });
    } else {
        res.status(400).json("Invalid user data")
    }

}



// @desc Login a new uer
// @route POST /auth/login
// @access Public
const loginAdmin = async (req,res) => {
   
   const {email, password} = req.body;
   const user = await Admin.findOne({email})

   if(user && (await bcrypt.compare(password, user.password))) {
    generateToken(res, user._id);
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePicture
    });
   } else {
    return res.status(400).json({error: "Invalid credentials"})
   } 
}


const updateProfilePicture = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    if (!profilePicture) {
      return res.status(400).json({ error: "No image URL provided" });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.user._id,
      { profilePicture },
      { new: true }
    );

    res.json({ message: "Profile picture updated successfully", admin: updatedAdmin });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ error: "Server error" });
  }
};




// LogOUT User
const logoutUser = async (req,res) => {
       res.cookie("jwt", "", {httpOnly: true, expiress: new Date(0)})
       res.json({message: "Logged out successfully"})
}
 

 const updateProfile = async (req, res) => {
    const { name } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(req.user._id, { name }, { new: true });
  
    res.json({ message: "Profile updated", admin: updatedAdmin.name });
  };
  




module.exports = {
    registerAdmin, loginAdmin, logoutUser, updateProfilePicture,updateProfile
}