// Exporting a socket instance is optional; Document page creates its own socket.
// Included for reference if you want a single shared socket instance.
import { io } from 'socket.io-client';
const socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000");
export default socket;
