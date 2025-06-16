// controllers/itemsController.js
const Item = require('../models/Item');

// GET /api/items
exports.getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find().sort({ addedAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

// GET /api/items/:id
exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

// POST /api/items
exports.addItem = async (req, res, next) => {
  try {
    const { name, description, price, category, size, image } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: "Field 'name' is required" });
    }
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice)) {
      return res.status(400).json({ error: "Field 'price' must be a number" });
    }
    const newItem = await Item.create({
      name:        name.trim(),
      description: (description || '').trim(),
      price:       numericPrice,
      category:    category || '',
      size:        size || '',
      image:       image || '',
      addedAt:     new Date()
    });
    res.status(201).json(newItem);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
};

// PUT /api/items/:id
exports.updateItem = async (req, res, next) => {
  try {
    const updates = {
      name:        req.body.name,
      description: req.body.description,
      price:       parseFloat(req.body.price),
      category:    req.body.category,
      size:        req.body.size,
      image:       req.body.image,
    };
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Item not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/items/:id
exports.deleteItem = async (req, res, next) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Item not found' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
