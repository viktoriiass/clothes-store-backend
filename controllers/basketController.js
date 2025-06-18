const BasketItem = require('../models/BasketItem');
const Item       = require('../models/Item');

// GET /api/basket
exports.getBasket = async (req, res, next) => {
  try {
    const entries = await BasketItem.find().populate('item');
    return res.status(200).json(entries);
  } catch (err) {
    next(err);
  }
};

// POST /api/basket
exports.addToBasket = async (req, res, next) => {
  try {
    const { item: itemId, size } = req.body;
    const product = await Item.findById(itemId);
    if (!product) return res.status(404).json({ error: 'Item not found' });

    let b = await BasketItem.findOne({ item: itemId, size });
    if (b) {
      b.quantity++;
      b.price = product.price;
      await b.save();
    } else {
      b = await BasketItem.create({
        item:     itemId,
        size,
        price:    product.price,
        quantity: 1
      });
    }

    // socket.io  connection
    if (req.io) {
      const all = await BasketItem.find().populate('item');
      const cleaned = all.filter(e => e.item && e.item._id);
      req.io.emit('basketUpdated', cleaned);
    }

    res.status(201).json(b);
  } catch (err) {
    next(err);
  }
};

// PUT /api/basket/:id
exports.updateBasketQuantity = async (req, res, next) => {
  try {
    const b = await BasketItem.findById(req.params.id);
    if (!b) return res.status(404).json({ message: 'Not found' });

    b.quantity = req.body.quantity;
    await b.save();

    // socket.io  connection
    if (req.io) {
      const all = await BasketItem.find().populate('item');
      const cleaned = all.filter(e => e.item && e.item._id);
      req.io.emit('basketUpdated', cleaned);
    }
    res.json(b);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/basket/:id
exports.deleteFromBasket = async (req, res, next) => {
  try {
    const deleted = await BasketItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });

    // socket.io  connection
    if (req.io) {
      const all = await BasketItem.find().populate('item');
      const cleaned = all.filter(e => e.item && e.item._id);
      req.io.emit('basketUpdated', cleaned);
    }
    res.json({ message: 'Removed' });
  } catch (err) {
    next(err);
  }
};
