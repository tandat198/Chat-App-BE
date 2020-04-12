const mongoose = require("mongoose");
const { GroupSchema } = require("./Group");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        default: "client"
    },
    groups: {
        type: [GroupSchema],
        ref: 'Group'
    }
});

const User = new mongoose.model("User", UserSchema);

module.exports = {
    UserSchema,
    User
};
