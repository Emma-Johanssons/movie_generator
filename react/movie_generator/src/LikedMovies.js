import React, { useState, useEffect } from "react";

function LikedMovies() {
  const [likedMovies, setLikedMovies] = useState([]);

  useEffect(() => {
    const fetchLikedMovies = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://movie-generator-ngpw.onrender.com/liked-movies",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setLikedMovies(data.liked_movies);
    };

    fetchLikedMovies();
  }, []);

  return (
    <div>
      <h1>Your Liked Movies</h1>
      <ul>
        {likedMovies.map((movie) => (
          <li key={movie.id}>{movie.movie_id}</li> // Ideally, you would fetch movie details here
        ))}
      </ul>
    </div>
  );
}

export default LikedMovies;
