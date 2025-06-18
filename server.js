// server.js
require('dotenv').config();
const express  = require('express');
const morgan   = require('morgan');
const cors     = require('cors');
const path     = require('path');
const mongoose = require('mongoose');
const http     = require('http');
const { Server } = require('socket.io');

const authRouter   = require('./routes/auth');
const itemsRouter  = require('./routes/items');
const basketRouter = require('./routes/basket');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

app.set('io', io);

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

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRouter);
app.use('/api/items',  itemsRouter);
app.use('/api/basket', basketRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>
  console.log(`✅ Backend running on http://localhost:${PORT}`)
);
