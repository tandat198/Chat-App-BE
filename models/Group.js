const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    }
});

const Group = new mongoose.model("Group", GroupSchema);

module.exports = {
    GroupSchema,
    Group
};
