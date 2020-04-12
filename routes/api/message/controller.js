const GroupMessage = require("../../../models/GroupMessage");
const { Message } = require("../../../models/Message");
const { User } = require("../../../models/User");

const postMessage = async (req, res) => {
    const { _id, name } = req.user;
    const { text, groupId } = req.body;
    try {
        const user = await User.findOne({ _id });
        if (!user) return res.status(403).json({ error: "User does not exist" });
        const newMessage = new Message({
            userId: _id,
            userName: name,
            text
        });
        const groupMessage = await GroupMessage.findOne({ groupId });
        groupMessage.messages.push(newMessage);
        await groupMessage.save();
        return res.status(200).json({ groupMessage });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

module.exports = {
    postMessage
};
