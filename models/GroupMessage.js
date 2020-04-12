const mongoose = require("mongoose");
const { MessageSchema } = require("./Message");

const GroupMessageSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    },
    messages: {
        type: [MessageSchema],
        ref: 'Message'
    }
});

module.exports = new mongoose.model("GroupMessage", GroupMessageSchema);
