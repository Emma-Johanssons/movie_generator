import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PopularMovies from "./PopularMovies";
function ProtectedPage() {
  const [welcomeName, setWelcomeName] = useState("Popcorn Enthusiast");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `https://movie-generator-ngpw.onrender.com/verify-token/${token}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Token verification failed");
        }
        const data = await response.json();
        setWelcomeName(data.first_name || "Popcorn Enthusiast");
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/");
      }
    };
    verifyToken();
  }, [navigate]);

  const logout = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch("https://movie-generator-ngpw.onrender.com/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.log("Error during logout");
    }
  };

  return (
    <div className="min-h-screen bg-[#4E2E54] text-[#F8F4E9] p-4">
      <h1 className="text-3xl sm:text-5xl font-bold text-center">
        Welcome to your dashboard, {welcomeName}
      </h1>
      <div className="flex justify-end mt-4">
        <button
          className="text-[#4E2E54] bg-[#F8F4E9] hover:bg-[#c6c2b9] focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          onClick={logout}
        >
          Sign out
        </button>
      </div>
      <PopularMovies />
    </div>
  );
}
export default ProtectedPage;
