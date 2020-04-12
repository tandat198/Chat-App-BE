const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userName: String,
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
