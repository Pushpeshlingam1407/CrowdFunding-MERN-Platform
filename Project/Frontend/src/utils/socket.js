import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    : "http://localhost:5000",
  {
    withCredentials: true,
    autoConnect: true,
  },
);

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("connect_error", (error) => {
  console.error("Socket.IO connection error:", error);
});

export default socket;
