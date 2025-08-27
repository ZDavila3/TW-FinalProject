const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  sourceType: { type:String, enum:['upload','paste'], required:true },
  filename: String,
  contentType: String,
  size: Number,
  originalText: String,
  analysis: mongoose.Schema.Types.Mixed,
  createdAt: { type:Date, default: Date.now }
});

module.exports = mongoose.model('Document', DocumentSchema);
