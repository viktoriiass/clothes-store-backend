const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  legacyId:   { type: String},
  name:       { type: String, required: true, trim: true },
  price:      { type: Number, required: true, min: 0 },
  description:{ type: String },
  category:   { type: String },
  size:       { type: String },
  image:      { type: String },
  addedAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
