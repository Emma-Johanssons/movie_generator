import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!username || !password) {
      setUsername("Email och password are required");
    }
    setError("");
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);
    try {
      const response = await fetch(
        "https://movie-generator-ngpw.onrender.com/token",
        {
          method: "POST",
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );
      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        navigate("/protected");
      } else {
        const errorData = await response.json();
        if (Array.isArray(errorData.detail)) {
          setError(
            errorData.detail.map((error, index) => (
              <div key={index}>
                <p>Type: {error.type}</p>
                <p>Location: {error.loc}</p>
                <p>Message: {error.msg}</p>
                <p>Input: {error.input}</p>
              </div>
            ))
          );
        } else {
          setError(
            <>
              <p>Type: {errorData.detail.type}</p>
              <p>Location: {errorData.detail.loc}</p>
              <p>Message: {errorData.detail.msg}</p>
              <p>Input: {errorData.detail.input}</p>
            </>
          );
        }
      }
    } catch (error) {
      setLoading(false);
      setError("An error occured. Please try again later");
    }
  };

  return (
    <div className="flex w-screen min-h-screen justify-center gap-10 items-center flex-col bg-[#4E2E54]">
      <h1 className="text-7xl text-[#F8F4E9] font-bold">Movie Generator</h1>
      <form
        className="shadow-md rounded px-8 pt-6 pb-8 bg-[#F8F4E9] p-3 flex flex-col justify-center"
        onSubmit={handleSubmit}
      >
        <div className="items-center justify-center flex flex-col">
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-[#954F75] ">
              Email:
            </label>
            <input
              className=" bg-[#4E2E54] border-2 border-[#47294c] text-[#F8F4E9] text-sm rounded-lg focus:ring-violet-200 focus:border-violet-200 block p-2.5 w-80"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-[#954F75]">
              Password:
            </label>
            <input
              className="bg-[#4E2E54] mb-3  border-2 border-[#47294c] text-[#F8F4E9] text-sm rounded-lg focus:ring-violet-200 focus:border-violet-200 block w-80 p-2.5"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div>
          <button
            className="text-white bg-[#954F75] hover:bg-[#4E2E54] focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in " : "Login"}
          </button>
          {error && <div>{error}</div>}
        </div>
        <p className="mt-2 text-[#47294c]">
          Don´t have an account?{" "}
          <a className="hover:text-[#816f7d]" href="/register">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
}
export default Login;
