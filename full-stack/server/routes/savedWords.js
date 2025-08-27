const express = require('express');
const router = express.Router();
const SavedWord = require('../models/SavedWord');
const auth = require('../middleware/auth');

// GET /api/saved-words
router.get('/', auth, async (req,res)=>{
  const words = await SavedWord.find({ userId: req.user.id }).sort({createdAt:-1});
  res.json(words);
});

// POST /api/saved-words { word }
router.post('/', auth, async (req,res)=>{
  const word = (req.body.word || '').trim();
  if(!word) return res.status(400).json({message:'Word required'});
  try{
    const doc = await SavedWord.create({ userId:req.user.id, word });
    res.status(201).json(doc);
  }catch(err){
    if (err.code === 11000) return res.status(409).json({message:'Already saved'});
    res.status(500).json({message:'Failed to save'});
  }
});

// DELETE /api/saved-words/:word
router.delete('/:word', auth, async (req,res)=>{
  await SavedWord.deleteOne({ userId:req.user.id, word:req.params.word });
  res.json({ ok:true });
});

module.exports = router;
