const mongoose = require("mongoose");
const { MessageSchema } = require("./Message");

const GroupMessageSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    },
    messages: {
        type: [MessageSchema],
        ref: "Message"
    }
});

GroupMessageSchema.method("transform", function () {
    const obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    return obj;
});

module.exports = new mongoose.model("GroupMessage", GroupMessageSchema);
