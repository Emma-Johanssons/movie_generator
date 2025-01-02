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
    <div>
      <h1>Welcome to your dashboard, {welcomeName}</h1>
      <PopularMovies />
      <button onClick={logout}>Log out</button>
    </div>
  );
}
export default ProtectedPage;
