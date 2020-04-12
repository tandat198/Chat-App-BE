const mongoose = require("mongoose");
const { UserSchema } = require("../models/User");

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: [mongoose.Schema.Types.ObjectId]
});

const Group = new mongoose.model("Group", GroupSchema);

module.exports = {
    GroupSchema,
    Group
};
