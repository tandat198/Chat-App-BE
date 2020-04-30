const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const { Message } = require("./models/Message");
const GroupMessage = require("./models/GroupMessage");
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIO = require('socket.io')
const io = socketIO(server)
const { mongoURI } = require('./config')
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//     next();
// });

app.use(express.json());

app.use("/api", cors(), require("./routes/api"));

mongoose.connect(
    mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => console.log("Connect to MongoDB successfully")
);

io.on("connection", function (socket) {
    socket.on("joinRoom", async function (data) {
        socket.join(data.room.id);
    });

    socket.on('room', async function (data) {
        if (data.msg && data.room.id) {
            const message = new Message({
                senderId: data.user.id,
                senderName: data.user.name,
                text: data.msg
            });
            io.to(data.room.id).emit("sendMsgFromServer", message.transform());

            const groupMessage = await GroupMessage.findOne({ groupId: data.room.id });
            groupMessage.messages.push(message);
            groupMessage.save();
        }
    })
});

server.listen(port, () => console.log(`Server is running on port ${port}`));
