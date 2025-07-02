const mongoose = require('mongoose');

const basketItemSchema = new mongoose.Schema({
  item:     { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  size:     { type: String },
  image:    { type: String },
  quantity: { type: Number, default: 1 },
  price:    { type: Number, required: true },
  addedAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('BasketItem', basketItemSchema);
