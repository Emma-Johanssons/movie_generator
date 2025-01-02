import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedPage() {
  const [welcomeName, setWelcomeName] = useState("Popcorn Enthusiast");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `https://movie-generator-ngpw.onrender.com/verify-token/${token}`
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

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <h1>Welcome to your dashboard, {welcomeName}</h1>
      <p>This is your personal movie generator set up</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}
export default ProtectedPage;
