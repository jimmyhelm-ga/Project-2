const mongoose = require('mongoose');

const poemSchema = new mongoose.Schema({
  poem: {
      type: String,
      required: true // Name is required
  },

  });

  const Poem = mongoose.model('Poem', poemSchema);

  module.exports = Poem;

  