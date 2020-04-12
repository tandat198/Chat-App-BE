const mongoose = require("mongoose");
const { MessageSchema } = require("./Message");

const GroupMessageSchema = new mongoose.Schema({
    groupId: mongoose.Schema.Types.ObjectId,
    messages: [MessageSchema]
});

module.exports = new mongoose.model("GroupMessage", GroupMessageSchema);
