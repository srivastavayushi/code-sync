const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");

const httpserver = http.createServer(app);
const io = new Server(httpserver);

const PORT = process.env.PORT || 3001;

httpserver.listen(PORT, () =>
  console.log(`Server has started at Port : ${PORT}`)
);
const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected with ID : ", socket.id);

  // as soon as a client joins, this event is triggered by frontend
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    // store that username inside userSocketMap
    userSocketMap[socket.id] = username;

    // socketId/user joins a room with unique roomId
    socket.join(roomId);

    // get all clients in that roomId to send them notification of a new member
    const clients = getAllConnectedClients(roomId);

    // send message to current members in the room
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        // who is joining
        username,
        socketId: socket.id,
      });
    });
  });

  // code change listener
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    // server also sends code_change event with updated code to all the users in roomId
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // sync code for initial join
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    // server also sends code_change event with updated code to all the users in roomId
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // just before disconnecting
  socket.on("disconnecting", () => {
    // get all the rooms
    const rooms = [...socket.rooms];

    // broadcast message in every room of socket.id, that user with given socket.id is going to disconnect
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    // delete the socket.id from userSocketMap
    delete userSocketMap[socket.id];
    socket.leave();
  });
});
