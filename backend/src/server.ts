import express from "express";
import http from "http";
import { Server } from "socket.io";
import { generatePodCode } from "./utils";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Pod management
interface Pod {
  host: string;
  players: string[];
}
const pods = new Map<string, Pod>();

io.on("connection", (socket) => {
  // Host creates a pod
  socket.on("host:create", (_, callback) => {
    let code: string;
    do {
      code = generatePodCode();
    } while (pods.has(code));
    pods.set(code, { host: socket.id, players: [] });
    socket.join(code);
    callback({ code }); // code is XXXXXX
  });

  // Player joins a pod
  socket.on("player:join", (data: { code: string }, callback) => {
    const { code } = data;
    const pod = pods.get(code);
    if (pod) {
      pod.players.push(socket.id);
      socket.join(code);
      callback({ success: true });
      io.to(pod.host).emit("player:joined", {
        playerId: socket.id,
      });
    } else {
      callback({ success: false, error: "Pod not found" });
    }
  });

  // Handle disconnects
  socket.on("disconnect", () => {
    for (const [code, pod] of pods.entries()) {
      if (pod.host === socket.id) {
        if (pod.players.length > 0) {
          // Assign new host
          const newHost = pod.players.shift();
          if (newHost) {
            pod.host = newHost;
            io.to(code).emit("host:changed", { newHost });
          }
        } else {
          // No players left, close pod
          io.to(code).emit("pod:closed");
          pods.delete(code);
        }
      } else {
        const index = pod.players.indexOf(socket.id);
        if (index !== -1) {
          pod.players.splice(index, 1);
          io.to(pod.host).emit("player:left", {
            playerId: socket.id,
          });
          // If no host and no players left, close pod
          if (pod.players.length === 0 && !pod.host) {
            io.to(code).emit("pod:closed");
            pods.delete(code);
          }
        }
      }
    }
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
