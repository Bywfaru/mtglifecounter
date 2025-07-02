import express from "express";
import http from "http";
import { Server } from "socket.io";
import { generateRoomCode } from "./utils";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Room management

interface Room {
  host: string;
  players: string[];
}
const rooms = new Map<string, Room>();

// Middleware

app.use(cors());

// Socket.io

io.on("connection", (socket) => {
  // Host creates a room
  console.log('A user connected:', socket.id);

  socket.on("host:create", () => {
    for (const room of rooms.values()) {
      if (room.host === socket.id) {
        // If the host is already in a room, do not allow creating a new one
        socket.emit('host:create_error', { message: "You are already hosting a room." });

        return;
      } else if (room.players.includes(socket.id)) {
        // If the host is already a player in a room, do not allow creating a new one
        socket.emit('host:create_error', { message: "You are already a player in a room." });

        return;
      }
    }

    let code: string;

    do {
      code = generateRoomCode();
    } while (rooms.has(code));

    rooms.set(code, { host: socket.id, players: [] });
    console.log('rooms:', Array.from(rooms.keys()));
    socket.join(code);
    socket.emit('host:create_success', { code });
  });

  // Player joins a room
  socket.on("player:join", ({ code }: { code: string }) => {
    
    for (const [roomCode, room] of rooms.entries()) {
      if (room.host === socket.id) {
        // If the host disconnects, remove the room
        socket.leave(roomCode);
        rooms.delete(roomCode);

        // Remove and notify all players in the room
        io.to(roomCode).emit("room:closed", { message: "Host has left the room. Room has been closed." });
        io.in(roomCode).socketsLeave(roomCode);
      } else if (room.players.includes(socket.id)) {
        // Remove player from the room if they are already in it
        socket.leave(code);

        room.players = room.players.filter((playerId) => playerId !== socket.id);
      }
    }

    const room = rooms.get(code);

    if (room) {
      room.players.push(socket.id);
      socket.join(code);
      socket.emit('player:join_success', { code, playerId: socket.id });
      io.to(code).emit("player:joined", {
        playerId: socket.id,
      });
    } else {
      socket.emit('player:join_error', { message: "Room not found" });
    }
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    // Remove player from all rooms
    for (const [code, room] of rooms.entries()) {
      if (room.host === socket.id) {
        // If the host disconnects, remove the room
        socket.leave(code);
        rooms.delete(code);

        // Remove and notify all players in the room
        io.to(code).emit("room:closed", { message: "Host has left the room. Room has been closed." });
        io.in(code).socketsLeave(code);
      } else {
        // If a player disconnects, remove them from the room
        room.players = room.players.filter(playerId => playerId !== socket.id);
      }
    }
  });
});

// REST API

// Checks if the room exists
app.get("/rooms/:code", (req, res) => {
  const { code } = req.params;

  if (rooms.has(code)) {
    res.status(200).send();
  } else {
    res.status(404).send();
  }
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
