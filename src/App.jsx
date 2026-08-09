import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { useEffect, useState } from 'react'
import Search from './components/Search.jsx'
import MovieCardSkeleton from './components/MovieCardSkeleton.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use'
import { getTrendingMovies, trackSearch } from './services/api.js'

const API_BASE_URL = 'https://www.omdbapi.com';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;



const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
const { user, logout } = useAuth();
  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [trendingMovies, setTrendingMovies] = useState([]);

  // Debounce the search term to prevent making too many API requests
  // by waiting for the user to stop typing for 500ms
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

const fetchMovies = async (query = '') => {
  setIsLoading(true);
  setErrorMessage('');

  try {
    // OMDb has no "discover popular movies" endpoint, so we fall back
    // to a fixed default search term when there's no query yet
    const searchQuery = query || 'Avengers';
    const endpoint = `${API_BASE_URL}/?apikey=${API_KEY}&s=${encodeURIComponent(searchQuery)}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error('Failed to fetch movies');
    }

    const data = await response.json();

    if (data.Response === 'False') {
      setErrorMessage(data.Error || 'Failed to fetch movies');
      setMovieList([]);
      return;
    }

    // Normalize OMDb's field names to match what MovieCard expects
    const normalizedMovies = data.Search.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      poster_path: movie.Poster !== 'N/A' ? movie.Poster : null,
      release_date: movie.Year,
      vote_average: null,
      original_language: null,
    }));

    setMovieList(normalizedMovies);

    if (query && normalizedMovies.length > 0) {
      await trackSearch(query, normalizedMovies[0]);
    }
  } catch (error) {
    console.error(`Error fetching movies: ${error}`);
    setErrorMessage('Error fetching movies. Please try again later.');
  } finally {
    setIsLoading(false);
  }
}
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (

  <Routes>
    <Route path="/" element={
      <main>
        <div className="pattern"/>

        <div className="wrapper">
          <header>
            <div className="flex justify-end gap-4 text-white mb-4">
              {user ? (
                <>
                  <span>Hi, {user.username}</span>
                  <button onClick={logout} className="underline">Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="underline">Log In</Link>
                  <Link to="/signup" className="underline">Sign Up</Link>
                </>
              )}
            </div>

            <img src="./hero.png" alt="Hero Banner" />
            <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          {trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>

              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie._id}>
                    <p>{index + 1}</p>
                    <img src={movie.posterUrl || '/no-movie.png'} alt={movie.searchTerm} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="all-movies">
            <h2>All Movies</h2>

            {isLoading ? (
              <ul>
                {Array.from({ length: 8 }).map((_, index) => (
                  <MovieCardSkeleton key={index} />
                ))}
              </ul>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    } />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </Routes>

  )
}

export default App
