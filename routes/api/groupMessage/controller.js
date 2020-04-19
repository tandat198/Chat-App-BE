const GroupMessage = require("../../../models/GroupMessage");

const getMessagesOfGroup = async (req, res) => {
    const { groupId } = req.query;
    const index = JSON.parse(req.query.index);

    try {
        const groupMessages = await GroupMessage.findOne({ groupId });
        if (!groupMessages) return res.status(404).json({ message: "Group's messages not found" });
        const resMessages = [];

        let messages;
        let lastIndex;
        let groupMessageLength = groupMessages.messages.length;
        let amountMessagesRes = 15;
        if (typeof index !== "number") {
            return res.status(400).json({ error: "Index is invalid" });
        } else {
            const resultDevideIndexWith15 = Math.floor(index / amountMessagesRes);
            switch (resultDevideIndexWith15) {
                case -1:
                    lastIndex = groupMessageLength > amountMessagesRes ? groupMessageLength - amountMessagesRes : 0;
                    messages = groupMessages.messages.slice(lastIndex, groupMessageLength);
                    break;
                case 0:
                    messages = groupMessages.messages.slice(0, index);
                    break;
                default:
                    lastIndex = index - amountMessagesRes;
                    messages = groupMessages.messages.slice(lastIndex, index);
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
