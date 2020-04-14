const app = require("express")();
const server = app.listen(5000);
const io = require("socket.io").listen(server);

io.on("connection", function (socket) {
    console.log("Connected");

    socket.on("room", async function (data) {
        socket.join(data.room._id);
        if (data.msg && data.room._id) {
            io.to(data.room._id).emit("sendMsgFromServer", `msg from server to room ${data.room._id}: ${data.msg} by ${data.user.name}`);
            const message = new Message({
                senderId: data.user._id,
                senderName: data.user.name,
                text: data.msg
            });
            const groupMessage = await GroupMessage.findOne({ groupId: data.room._id });
            groupMessage.messages.push(message);
            groupMessage.save();
        }
    });
});
