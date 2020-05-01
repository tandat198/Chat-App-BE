const GroupMessage = require("../../../models/GroupMessage");
const Message = require("../../../models/Message")

const getMessagesOfGroup = async (req, res) => {
    const { groupId } = req.query;
    const index = JSON.parse(req.query.index);

    try {
        const groupMessages = await Message.find({ groupId })
        if (!groupMessages.length) return res.status(404).json({ message: "Group's messages not found" });
        const resMessages = [];

        let messages;
        let lastIndex;
        let groupMessageLength = groupMessages.length;
        let amountMessagesRes = 15;
        if (typeof index !== "number") {
            return res.status(400).json({ error: "Index is invalid" });
        } else {
            const resultDevideIndexWith15 = Math.floor(index / amountMessagesRes);
            switch (resultDevideIndexWith15) {
                case -1:
                    lastIndex = groupMessageLength - amountMessagesRes;
                    messages = groupMessages.slice(lastIndex, groupMessageLength);
                    break;
                case 0:
                    messages = groupMessages.slice(0, index);
                    break;
                default:
                    lastIndex = index - amountMessagesRes;
                    messages = groupMessages.slice(lastIndex, index);
                    break;
            }
        }

        for (message of messages) {
            resMessages.push(message.transform());
        }
        return res.status(200).json({ messages: resMessages, index: lastIndex });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

module.exports = {
    getMessagesOfGroup
};
