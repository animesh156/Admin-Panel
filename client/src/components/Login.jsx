import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { toast, ToastContainer } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginResponse = await API.post(
        "/login", // Ensure this matches backend route
        { email, password },
        { withCredentials: true }
      );

      if (loginResponse.status === 200) {
        toast.success("Login successful!", { position: "top-center", autoClose: 3000 });

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userName", loginResponse.data.name);
        localStorage.setItem("profilePic", loginResponse.data.profilePic);

        setTimeout(() => navigate("/"), 2000); // No need to reload
      } 
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed. Please check your credentials.", {
        position: "top-center",
        autoClose: 4000,
      });
      console.error("Login error:", err);
    }
  };

  return (
    <div 
    className="flex items-center justify-center h-screen"
    style={{
      backgroundImage:
        "url('https://res.cloudinary.com/dmdlgpurh/image/upload/v1736879584/pexels-souvenirpixels-1542493_dke22u.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}

    >
      <ToastContainer />
      <div className="bg-neutral-950 md:mt-28  mt-16 rounded-md flex flex-col m-auto p-8 w-72 md:w-96">
        <h1 className="text-center text-2xl mb-3 font-bold text-white">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="required py-2 w-full px-3 text-white bg-neutral-900 border-gray-300 border-2 rounded-md"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="required py-2 w-full px-3 text-white bg-neutral-900 border-gray-300 border-2 rounded-md"
            />
          </div>

          <div>
            <button type="submit" className="py-2 w-full px-3 font-semibold cursor-pointer rounded-md bg-sky-400 hover:bg-sky-500">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
