const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const port = process.env.PORT || 5000;
const { Message } = require("./models/Message");
const GroupMessage = require("./models/GroupMessage");
const app = express();
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//     next();
// });

app.use(express.json());

app.use("/api", cors(), require("./routes/api"));

mongoose.connect(
    `mongodb+srv://datng198:Dat12345678@cluster0-xejqn.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => console.log("Connect to MongoDB successfully")
);

const server = app.listen(port, () => console.log(`Server is running on port ${port}`));

const io = require("socket.io").listen(server);

io.on("connection", function (socket) {
    console.log("Connected");

    socket.on("room", async function (data) {
        socket.join(data.room.id);
        if (data.msg && data.room.id) {
            const message = new Message({
                senderId: data.user.id,
                senderName: data.user.name,
                text: data.msg
            });
            console.log(data);
            io.to(data.room.id).emit("sendMsgFromServer", message);
            const groupMessage = await GroupMessage.findOne({ groupId: data.room.id });
            groupMessage.messages.push(message);
            groupMessage.save();
        }
    });
});
