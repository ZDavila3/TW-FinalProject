const express = require('express');
const router = express.Router();
const multer = require('multer');
const Document = require('../models/Document');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 }});

// POST /api/documents/text  { filename?, text, analysis }
router.post('/text', auth, async (req,res)=>{
  const { filename='Pasted Text', text='', analysis } = req.body || {};
  if(!text.trim()) return res.status(400).json({message:'Text required'});
  const doc = await Document.create({
    userId: req.user.id,
    sourceType: 'paste',
    filename,
    size: text.length,
    contentType: 'text/plain',
    originalText: text,
    analysis
  });
  res.status(201).json(doc);
});

// POST /api/documents/upload (multipart FormData: file, analysis JSON string, extractedText optional)
router.post('/upload', auth, upload.single('file'), async (req,res)=>{
  const { analysis, extractedText } = req.body || {};
  const analysisObj = analysis ? JSON.parse(analysis) : undefined;

  const doc = await Document.create({
    userId: req.user.id,
    sourceType: 'upload',
    filename: req.file?.originalname || 'Upload',
    size: req.file?.size,
    contentType: req.file?.mimetype,
    originalText: extractedText,
    analysis: analysisObj
  });
  res.status(201).json(doc);
});

module.exports = router;
