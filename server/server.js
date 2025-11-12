// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from /public
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 10000;

io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // Listen for chat messages
  socket.on("message", (msg) => {
    console.log(`📩 ${socket.id}: ${msg}`);
    socket.broadcast.emit("message", msg); // send to everyone except sender
  });

  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
