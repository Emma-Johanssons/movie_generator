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
      const response = await fetch("http://localhost:8000/token", {
        method: "POST",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });
      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        navigate("/protected");
      } else {
        const errorData = await response.json();
        if (Array.isArray(errorData.detail)) {
          // Om det är en array, visa varje objekt i listan
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
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in " : "Login"}
        </button>
        {error && <div>{error}</div>}
      </form>
    </div>
  );
}
export default Login;
