import { useState } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";

const ProfileNameUpdate = ({ onUpdate }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      const response = await API.put("/update-profile", { name }, { withCredentials: true });
      toast.success("Profile name updated successfully!");

      // Update the parent component with the new name
      onUpdate(response.data.admin);

      // Store updated name in localStorage
      localStorage.setItem("userName", response.data.admin);

      setName("");
    } catch (error) {
      toast.error("Failed to update profile name.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-neutral-900 md:p-6 p-4 rounded-lg shadow-lg w-72 md:w-80">
      <h2 className="text-lg text-pink-500 font-semibold mb-4">Update Profile Name</h2>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Enter new name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border bg-neutral-800 text-sky-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
      />

      {/* Update Button */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className={`mt-4 w-full px-4 py-2 rounded-lg text-white font-semibold transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-900"
        }`}
      >
        {loading ? "Updating..." : "Update Name"}
      </button>
    </div>
  );
};

export default ProfileNameUpdate;
