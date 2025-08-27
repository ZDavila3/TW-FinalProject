const mongoose = require('mongoose');

const SavedWordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  word: { type:String, required:true, trim:true },
  createdAt: { type:Date, default: Date.now }
});

SavedWordSchema.index({ userId:1, word:1 }, { unique:true });

module.exports = mongoose.model('SavedWord', SavedWordSchema);
