import React, { useState } from "react";

function MovieCard({ movie }) {
  const [liked, setLiked] = useState(false);

  const likeMovie = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "https://movie-generator-ngpw.onrender.com/like-movie",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ movie_id: movie.id }),
        }
      );
      if (response.ok) {
        setLiked(true);
      } else {
        alert("Error liking the movie");
      }
    } catch (error) {
      alert("Error occurred");
    }
  };

  return (
    <div>
      <h3>{movie.title}</h3>
      <p>{movie.overview}</p>
      <button onClick={likeMovie} disabled={liked}>
        {liked ? "Liked" : "Like"}
      </button>
    </div>
  );
}

export default MovieCard;
