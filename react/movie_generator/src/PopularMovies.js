import React, { useState, useEffect } from "react";

function PopularMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "https://movie-generator-ngpw.onrender.com/popular-movies",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch popular movies");
        }
        const data = await response.json();
        setMovies(data.results); // Fyll lista med filmer från backend
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  if (loading) return <div>Loading popular movies...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold mt-4">Popular Movies</h2>
      <div className="grid grid-cols-5 gap-4 ">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card flex flex-col items-center">
            <img
              className="h-80  rounded-lg shadow-md"
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              alt={movie.title}
            />
            <h3 className=" text-center my-2 ">{movie.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PopularMovies;
