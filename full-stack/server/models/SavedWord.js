const mongoose = require('mongoose');

const SavedWordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  word: { type: String, required: true },
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedWord', SavedWordSchema);
