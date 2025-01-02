import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !password) {
      setError("Username and password are required");
      return false;
    }
    setError("");
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = {
      username,
      password,
      first_name: firstName,
    };
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch(
        "https://movie-generator-ngpw.onrender.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );
      setLoading(false);
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate("/"), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Registration failed");
      }
    } catch (error) {
      setLoading(false);
      setError("An error occured. Please try again later");
    }
  };

  return (
    <div className="flex w-screen min-h-screen justify-center gap-10 items-center flex-col bg-[#4E2E54]">
      <h1 className="text-4xl sm:text-7xl text-[#F8F4E9] font-bold">
        Register
      </h1>
      <form
        className="shadow-md rounded px-8 pt-6 pb-8 bg-[#F8F4E9] p-3 flex flex-col justify-center w-full sm:w-96"
        onSubmit={handleSubmit}
      >
        <div className="items-center justify-center flex flex-col">
          <div className="mb-5 w-full">
            <label className="block mb-2 text-sm font-medium text-[#954F75]">
              First Name (optional):
            </label>
            <input
              className="bg-[#4E2E54] border-2 border-[#47294c] text-[#F8F4E9] text-sm rounded-lg focus:ring-violet-200 focus:border-violet-200 block p-2.5 w-full sm:w-80"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-5 w-full">
          <label className="block mb-2 text-sm font-medium text-[#954F75]">
            Email:
          </label>
          <input
            className="bg-[#4E2E54] border-2 border-[#47294c] text-[#F8F4E9] text-sm rounded-lg focus:ring-violet-200 focus:border-violet-200 block p-2.5 w-full sm:w-80"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-5 w-full">
          <label className="block mb-2 text-sm font-medium text-[#954F75]">
            Password:
          </label>
          <input
            className="bg-[#4E2E54] mb-3 border-2 border-[#47294c] text-[#F8F4E9] text-sm rounded-lg focus:ring-violet-200 focus:border-violet-200 block p-2.5 w-full sm:w-80"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button
            className="text-white bg-[#954F75] hover:bg-[#4E2E54] focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          {error && <div className="text-red-500">{error}</div>}
          {success && (
            <div className="text-[#954F75]">Registration successful!</div>
          )}
        </div>
        <p className="mt-2 text-[#47294c] text-sm sm:text-base">
          Go back to{" "}
          <a className="hover:text-[#816f7d]" href="/">
            sign in page
          </a>
        </p>
      </form>
    </div>
  );
}
export default Register;
