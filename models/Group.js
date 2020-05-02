const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    }
}, {
    timestamps: true
});

GroupSchema.method("transform", function () {
    const obj = this.toObject();

    obj.id = obj._id;
    delete obj._id;
    return obj;
});

const Group = new mongoose.model("Group", GroupSchema);

module.exports = {
    GroupSchema,
    Group
};
