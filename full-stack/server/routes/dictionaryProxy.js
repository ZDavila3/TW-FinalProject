const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, async (req,res)=>{
  const word = (req.query.word || '').trim();
  if(!word) return res.status(400).json({message:'Missing word'});
  try{
    const r = await fetch(`https://api.api-ninjas.com/v1/dictionary?word=${encodeURIComponent(word)}`, {
      headers: { 'X-Api-Key': process.env.API_NINJAS_KEY }
    });
    if(!r.ok) return res.status(502).json({message:'Upstream error'});
    const data = await r.json();
    res.json(data);
  }catch(e){
    res.status(500).json({message:'Lookup failed'});
  }
});

module.exports = router;
