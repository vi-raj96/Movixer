import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_KEY = 'a9118a3a';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    // Fetch latest movies on initial load
    const fetchLatestMovies = async () => {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?s=latest&apikey=${API_KEY}`
        );
        setMovies(response.data.Search);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLatestMovies();
  }, []);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchMovies = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`
      );
      setMovies(response.data.Search);
      setSearchTerm('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleMovieClick = async (id) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}`);
      setSelectedMovie(response.data);
      scrollToTop();
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelClick = () => {
    setSelectedMovie(null);
  };

  const scrollToTop = () => {
    const scrollStep = -window.scrollY / (1000 / 15);
    const scrollAnimation = () => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
        requestAnimationFrame(scrollAnimation);
      }
    };
    requestAnimationFrame(scrollAnimation);
  };

  return (
    <div className="App">
      <header>
        <form onSubmit={searchMovies}>
          <h1>Movixer</h1>
          <input
            type="text"
            placeholder="Search movies"
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button type="submit">Search</button>
        </form>
      </header>
      {selectedMovie && (
        <div className="selected-movie">
          <div className="poster-container">
            <img
              src={selectedMovie.Poster}
              alt={selectedMovie.title}
            />
          </div>
          <div className="movie-details">
            <p>Overview : {selectedMovie.Plot}</p>
            <p>IMDB Rating : {selectedMovie.imdbRating}</p>
            <p>Language : {selectedMovie.Language}</p>
            <p>Released : {selectedMovie.Released}</p>
            <p>Runtime : {selectedMovie.Runtime}</p>
            <p>Genre : {selectedMovie.Genre}</p>
            <p>Director : {selectedMovie.Director}</p>
            <p>Actors : {selectedMovie.Actors}</p>
            <button className="cancel-button" onClick={handleCancelClick}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="movies">
        {movies ? (
          <>
            {movies.map((movie) => (
              <div key={movie.imdbID} className="movie" onClick={() => handleMovieClick(movie.imdbID)}>
                <img
                  src={movie?.Poster}
                  alt={movie.Title}
                />
                <h3>{movie.Title}</h3>
                <div className="movies-info">
                  <p>Year : {movie.Year}</p>
                  <p>Type : {movie.Type}</p>
                </div>
              </div>
            ))}
          </>
        ) : (
          "Not Found....."
        )}
      </div>
    </div>
  );
}

export default App;
