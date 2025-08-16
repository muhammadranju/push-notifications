const socket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Handle sending a message
    socket.on("send-notification", (data) => {
      // Broadcast to all other users
      socket.emit("send-notification", data);
      console.log(data);
    });
    //disconnect socket
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};

export const SocketHelper = { socket };
