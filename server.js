// server.js
require('dotenv').config();
const express  = require('express');
const morgan   = require('morgan');
const cors     = require('cors');
const path     = require('path');
const mongoose = require('mongoose');

const authRouter = require('./routes/auth');
const itemsRouter  = require('./routes/items');
const basketRouter = require('./routes/basket');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ Mongo connection error:', err);
    process.exit(1);
  });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRouter);
app.use('/api/items',  itemsRouter);
app.use('/api/basket', basketRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
