const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Group"
    },
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
}, {
    timestamps: true
});

MessageSchema.method("transform", function () {
    const obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    return obj;
});

const Message = new mongoose.model("Message", MessageSchema);

module.exports = {
    MessageSchema,
    Message
};
