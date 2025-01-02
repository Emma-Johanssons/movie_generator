import React, { useState } from "react";

function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://movie-generator-ngpw.onrender.com/search-movies?query=${query}`
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a movie..."
      />
      <button onClick={searchMovies} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
      <div>
        {movies.length > 0 ? (
          <ul>
            {movies.map((movie) => (
              <li key={movie.id}>
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No movies found.</p>
        )}
      </div>
    </div>
  );
}

export default MovieSearch;
