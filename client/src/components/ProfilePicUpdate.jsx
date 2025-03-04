import { useState } from "react";
import API from "../utils/api";
import { toast, ToastContainer } from "react-toastify";

const ProfilePicUpdate = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET); 
    formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

    try {
      setLoading(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await response.json();
      setLoading(false);
    
      return data.secure_url;
    } catch (error) {
      setLoading(false);
      console.error("Cloudinary Upload Error:", error);
      toast.error("Failed to upload image.");
      return null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;


    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, JPEG, or PNG files are allowed.");
      return;
    }

    // Validate file size (must be < 200 KB)
    const maxSize = 200 * 1024; // 200 KB in bytes
    if (file.size > maxSize) {
      toast.error("File size must be less than 200 KB.");
      return;
    }


    setImage(file);
    setImagePreview(URL.createObjectURL(file)); // Show preview before upload
  };

  const handleUpdateClick = async () => {
    if (!image) {
      toast.error("Please select an image first.");
      return;
    }

    const imageUrl = await uploadToCloudinary(image);
    if (imageUrl) {
      updateProfilePicture(imageUrl);
    }
  };

  const updateProfilePicture = async (imageUrl) => {
    try {
      const response = await API.put(
        "/update-profile-picture",
        { profilePicture: imageUrl },
        { withCredentials: true }
      );
      toast.success("Profile picture updated!");
      setTimeout(() => {
        localStorage.setItem("profilePic", response.data.admin.profilePicture);
        window.location.reload();
      },1000)
     
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile picture.");
    }
  };

  return (
    <div className="flex flex-col items-center bg-neutral-900 md:p-6 p-4 rounded-lg shadow-lg w-72 md:w-80">
     <ToastContainer />
      <h2 className="text-lg font-semibold text-pink-500 mb-4">Update Profile Picture</h2>

      {/* File Input */}
      <label className="w-full flex flex-col items-center bg-neutral-800 border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-neutral-700 transition">
        <span className="text-gray-600 text-sm">Choose an Image</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={loading}
          className="hidden"
        />
      </label>

      {/* Preview Image */}
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          className="w-24 h-24 rounded-full border-4 border-gray-300 mt-4 shadow-md transition hover:shadow-lg"
        />
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpdateClick}
        disabled={loading}
        className={`mt-4 w-full px-4 py-2 rounded-lg text-white font-semibold transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-900"
        }`}
      >
        {loading ? "Uploading..." : "Update"}
      </button>
    </div>
  );
};

export default ProfilePicUpdate;
