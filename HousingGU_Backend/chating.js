const http = require("http");
const socketIO = require("socket.io");

const server = http.createServer();
const io = socketIO(server, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
		allowedHeaders: ["Content-Type"],
		credentials: true,
	},
});

io.on("connection", (socket) => {
	console.log("A user connected to " + socket);

	socket.on("chatMessage", (message) => {
		console.log(`Received message: ${message}`);
		io.emit("chatMessage", message);
	});

	socket.on("disconnect", () => {
		//console.log("A user disconnected");
	});
});

server.listen(3000, () => {
	console.log("Socket.IO Chatting server listening on port 3000");
});
