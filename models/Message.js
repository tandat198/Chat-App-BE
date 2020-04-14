const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    senderName: String,
    text: {
        type: String,
        required: true
    }
});
const Message = new mongoose.model("Message", MessageSchema);

module.exports = {
    MessageSchema,
    Message
};
