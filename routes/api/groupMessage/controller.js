const { Message } = require("../../../models/Message")

const getMessagesOfGroup = async (req, res) => {
    const { groupId } = req.query;
    const skip = + req.query.skip;
    const limit = + req.query.limit;

    try {
        if (skip < 0 || limit < 0) {
            return res.status(400).json({ error: "Index is invalid" });
        }
        const groupMessages = await Message.find({ groupId }).limit(limit).skip(skip).sort({ createdAt: -1 })
        const messages = groupMessages.sort((m1, m2) => m1.createdAt - m2.createdAt);
        return res.status(200).json({ messages });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

module.exports = {
    getMessagesOfGroup
};
