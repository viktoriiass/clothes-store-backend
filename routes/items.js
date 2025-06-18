const express = require('express');
const multer  = require('multer');
const path    = require('path');
const {
  getAllItems,
  getItemById,
  addItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemsController');

const router = express.Router();

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});
const upload = multer({ storage });

// GET all items
router.get('/', getAllItems);

// GET a single item by ID
router.get('/:id', getItemById);

// POST a new item (with optional image)
router.post('/', upload.single('image'), (req, res, next) => {
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }

  // 🔥 подключаем socket.io
  req.io = req.app.get('io');
  addItem(req, res, next);
});

// PUT update an existing item (with optional new image)
router.put('/:id', upload.single('image'), (req, res, next) => {
  if (req.file) {
    req.body.image = `/uploads/${req.file.filename}`;
  }
  updateItem(req, res, next);
});

// DELETE one item
router.delete('/:id', (req, res, next) => {
  req.io = req.app.get('io'); // 🔧 передаём io в контроллер
  deleteItem(req, res, next);
});

module.exports = router;
