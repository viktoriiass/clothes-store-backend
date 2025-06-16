const express = require('express');
const router = express.Router();


const {
  getBasket,
  addToBasket,
  deleteFromBasket,
  updateBasketQuantity
} = require('../controllers/basketController');

// GET all items in basket
router.get('/', getBasket);

// POST to add item to basket
router.post('/', addToBasket);

// DELETE specific item (by id and optional size)
router.delete('/:id', deleteFromBasket);

// PUT to update item quantity  in basket
router.put('/:id', updateBasketQuantity);

module.exports = router;
