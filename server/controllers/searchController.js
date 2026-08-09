import Search from '../models/Search.js';

// POST /api/search
export const trackSearch = async (req, res) => {
  try {
    const { searchTerm, movieId, posterUrl } = req.body;

    if (!searchTerm || !movieId || !posterUrl) {
      return res.status(400).json({ message: 'searchTerm, movieId, and posterUrl are required' });
    }

    const existing = await Search.findOne({ searchTerm });

    if (existing) {
      existing.count += 1;
      await existing.save();
      return res.status(200).json({ success: true, data: existing });
    }

    const newSearch = await Search.create({ searchTerm, movieId, posterUrl });
    return res.status(201).json({ success: true, data: newSearch });

  } catch (error) {
    console.error('trackSearch error:', error.message);
    res.status(500).json({ message: 'Server error while tracking search' });
  }
};

// GET /api/search/trending
export const getTrendingSearches = async (req, res) => {
  try {
    const trending = await Search.find().sort({ count: -1 }).limit(5);
    res.status(200).json({ success: true, data: trending });
  } catch (error) {
    console.error('getTrendingSearches error:', error.message);
    res.status(500).json({ message: 'Server error while fetching trending searches' });
  }
};