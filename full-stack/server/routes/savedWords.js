const express = require('express');
const router = express.Router();
const SavedWord = require('../models/SavedWord');
const { authenticate } = require('../middleware/auth');

// Save a word for the logged-in user
router.post('/', authenticate, async (req, res) => {
  const { word } = req.body;
  if (!word || typeof word !== 'string') {
    return res.status(400).json({ error: 'Word is required.' });
  }
  try {
    // Prevent duplicate save for same user/word
    const existing = await SavedWord.findOne({ user: req.user._id, word });
    if (existing) {
      return res.status(200).json({ message: 'Word already saved.' });
    }
    const saved = await SavedWord.create({ user: req.user._id, word });
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save word.' });
  }
});

// Get all saved words for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const words = await SavedWord.find({ user: req.user._id }).sort({ savedAt: -1 });
    res.json(words);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch saved words.' });
  }
});

module.exports = router;
