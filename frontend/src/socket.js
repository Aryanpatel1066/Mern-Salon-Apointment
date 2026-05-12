import { io } from "socket.io-client";

const socket = io("https://mern-salon-apointment.onrender.com", {
  withCredentials: true,
});

export default socket;