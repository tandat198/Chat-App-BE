const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const { Message } = require("./models/Message");
const GroupMessage = require("./models/GroupMessage");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
const { mongoURI } = require("./config");

app.use(express.json());

app.use("/api", cors(), require("./routes/api"));

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => console.log("Connect to MongoDB successfully"));

io.on("connection", function (socket) {
    socket.on("joinRoom", async function (data) {
        socket.join(data.room.id);
    });

    socket.on("room", function (data) {
        if (data.msg && data.room.id) {
            const message = new Message({
                groupId: data.room.id,
                senderId: data.user.id,
                senderName: data.user.name,
                text: data.msg
            });
            message.save().then(message => {
                io.to(data.room.id).emit("sendMsgFromServer", message);
            });
        }
    });
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
