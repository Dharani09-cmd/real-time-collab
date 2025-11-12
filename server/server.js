import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Document from "./models/Document.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use((req,res,next)=>{res.setHeader('Access-Control-Allow-Origin','*');res.setHeader('Access-Control-Allow-Headers','*');next();});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/realtime-collab";
mongoose.connect(MONGO).then(()=>console.log("Mongo connected")).catch(err=>console.error(err));

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-document", async (documentId) => {
    if (!documentId) return;
    socket.join(documentId);
    console.log("Joined room:", documentId);

    const document = await findOrCreateDocument(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data }, { upsert: true });
    });

    socket.on("disconnect", () => {
      // optionally handle disconnect
    });
  });
});

async function findOrCreateDocument(id) {
  if (!id) return;
  let doc = await Document.findById(id);
  if (doc) return doc;
  return await Document.create({ _id: id, data: { ops: [{ insert: "\n" }] } });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log("Server listening on", PORT));
