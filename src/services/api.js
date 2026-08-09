const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const trackSearch = async (searchTerm, movie) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchTerm,
        movieId: movie.id,
        posterUrl:  movie.poster_path,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to track search');
    }
  } catch (error) {
    console.error('trackSearch error:', error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/search/trending`);

    if (!response.ok) {
      throw new Error('Failed to fetch trending movies');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('getTrendingMovies error:', error);
    return [];
  }
};