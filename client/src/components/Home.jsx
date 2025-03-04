/* eslint-disable no-unused-vars */
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";
import ProfilePicUpdate from "./ProfilePicUpdate";
import ProfileNameUpdate from "./ProfileNameUpdate";

const Dashboard = () => {
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const storedUserName = localStorage.getItem("userName");
  const storedProfilePic = localStorage.getItem("profilePic");

  const [userName, setUserName] = useState(storedUserName);
  const [profilePic, setProfilePic] = useState(storedProfilePic);

  if (!isAuthenticated) {
    navigate("/login");
    
  }

  const handleLogout = async () => {
    try {
      await API.post("/logout", {}, { withCredentials: true });
      toast.success("Logged out successfully");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userName");
      localStorage.removeItem("profilePic");

      setTimeout(() => {
        navigate("/login");
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast.error("Logout failed. Please try again");
      console.log(error);
    }
  };

  return (
    <div className="flex mt-12 items-center flex-col">
      <h1 className="text-3xl text-sky-400 font-semibold">Welcome, <span className="uppercase">{userName}</span></h1>
      <img src={profilePic} alt="Profile" className="w-36 h-36 rounded-full mt-2" />

      <div className="flex flex-col md:flex-row gap-y-6 items-center gap-x-5 mt-7 mb-5">

          {/* Profile Picture Update */}
      <ProfilePicUpdate />

{/* Profile Name Update */}
<ProfileNameUpdate onUpdate={(newName) => setUserName(newName)} />

      </div>
      
    

      <button
        className="mt-4 w-20 bg-red-500 hover:bg-red-700 cursor-pointer text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
