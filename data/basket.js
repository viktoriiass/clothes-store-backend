const express = require('express');
const router  = express.Router();

const {
  getBasket,
  addToBasket,
  updateBasketQuantity,
  deleteFromBasket
} = require('../controllers/basketController');

//   GET /api/basket
router.get('/', getBasket);

//   POST /api/basket
router.post('/', addToBasket);

//   PUT /api/basket/:id
router.put('/:id', updateBasketQuantity);

//   DELETE /api/basket/:id
router.delete('/:id', deleteFromBasket);

module.exports = router;
