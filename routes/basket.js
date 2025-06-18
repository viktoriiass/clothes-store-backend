const express = require('express');
const router = express.Router();

const {
  getBasket,
  addToBasket,
  deleteFromBasket,
  updateBasketQuantity
} = require('../controllers/basketController');
//socket.io connection-real time updates
//GET
router.get('/', getBasket);

//POST
router.post('/', (req, res, next) => {
  req.io = req.app.get('io'); //socket.io  connection
  addToBasket(req, res, next);
});

//DELETE
router.delete('/:id', (req, res, next) => {
  req.io = req.app.get('io'); //socket.io connection
  deleteFromBasket(req, res, next);
});

//PUT
router.put('/:id', (req, res, next) => {
  req.io = req.app.get('io');//socket.io connection
  updateBasketQuantity(req, res, next);
});

module.exports = router;
