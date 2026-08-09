import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
  searchTerm: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  count: {
    type: Number,
    default: 1,
  },
  movieId: {
    type: String ,
    required: true,
  },
  posterUrl: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Search = mongoose.model('Search', searchSchema);

export default Search;