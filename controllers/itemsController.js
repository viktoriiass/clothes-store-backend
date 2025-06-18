// controllers/itemsController.js
const Item = require('../models/Item');
const BasketItem = require('../models/BasketItem');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

    // 🔥 отправляем событие socket.io
    if (req.io) {
      req.io.emit('inventoryUpdated', newItem);
    }

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
    const id = req.params.id;
    console.log('START DELETE: item ID =', id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('INVALID OBJECT ID');
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    const item = await Item.findById(id);
    if (!item) {
      console.log('ITEM NOT FOUND IN DB');
      return res.status(404).json({ error: 'Item not found' });
    }

    console.log('ITEM FOUND:', item.name);

    if (item.image) {
      const fileName = item.image.split('/').pop();
      const filePath = path.join(__dirname, '..', 'uploads', fileName);

      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete image file:', err);
            else console.log('Deleted image file:', filePath);
          });
        } else {
          console.warn('Image file not found on server:', filePath);
        }
      });
    }

    await Item.findByIdAndDelete(id);
    if (req.io) {
      req.io.emit('inventoryDeleted', { itemId: id });
    }
    console.log('ITEM DELETED FROM COLLECTION');

    const result = await BasketItem.deleteMany({ item: id });
    console.log(`BASKET ENTRIES DELETED: ${result.deletedCount}`);

    // updated basket
    const updatedBasket = await BasketItem.find().populate('item');
    req.io.emit('basketUpdated', updatedBasket);

    res.status(200).json({ message: 'Item and basket entries deleted successfully' });

  } catch (err) {
    console.error('FAILED TO DELETE ITEM:', err);
    res.status(500).json({ error: 'Server error during deletion' });
  }
};


