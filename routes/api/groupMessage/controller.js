const GroupMessage = require("../../../models/GroupMessage");

const getMessagesOfGroup = async (req, res) => {
    const { groupId } = req.query;
    console.log(groupId);
    try {
        const groupMessages = await GroupMessage.findOne({ groupId });
        if (!groupMessages) return res.status(404).json({ message: "Group's messages not found" });
        const resMessages = [];
        for (message of groupMessages.messages) {
            resMessages.push(message.transform());
        }
        return res.status(200).json({ messages: resMessages });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

module.exports = {
    getMessagesOfGroup
};
