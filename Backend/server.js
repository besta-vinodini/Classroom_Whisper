// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const doubtRoutes = require('./routes/doubtRoutes');
const cors = require('cors');
const path = require('path');


const app = express();
require('dotenv').config();

connectDB();

app.use(cors(
  {
    origin: "*",
    methods: ["GET", "POST", "PUT","DELETE"],
    allowedHeaders: ["Content-Type"],
  }
));
app.use(express.json());
app.use('/api/doubts', doubtRoutes);


// Serve static frontend
app.use(express.static(path.join(__dirname, "frontend")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('sendDoubt', (doubt) => {
    socket.broadcast.emit('receiveDoubt', doubt);
  });

  socket.on('resolveDoubt', (id) => {
    socket.broadcast.emit('doubtResolved', id);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
