const { Group } = require("../../../models/Group");
const GroupMessage = require("../../../models/GroupMessage");
const { User } = require("../../../models/User");

const createGroup = async (req, res) => {
    const { name } = req.body;
    const { email } = req.user;
    if (!name) return res.status(500).json({ error: "Group name is required" });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(500).json({ error: "User does not exist" });
        const group = new Group({
            name,
            users: [user.id]
        });
        const groupMessage = new GroupMessage({
            groupId: group._id
        });
        user.groups.push(group);
        await Promise.all([group.save(), groupMessage.save(), user.save()]);
        return res.status(201).json({ group });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const addNewUserToGroup = async (req, res) => {
    const { groupId, userId } = req.body;

    try {
        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(400).json({ error: "User does not exist" });
        const group = await Group.findOne({ _id: groupId });
        if (!group) return res.status(404).json({ error: "Group not found" });

        const usersInGroup = group.users;
        const duplicateUser = usersInGroup.find(id => id == userId);
        if (duplicateUser) return res.status(500).json({ error: "User is already in this group" });

        group.users.push(user.id);
        user.groups.push(group);
        await Promise.all([group.save(), user.save()]);
        return res.status(200).json({ group });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

const getGroups = async (req, res) => {
    const { email } = req.user;
    try {
        const user = await User.findOne({ email });
        return res.status(200).json({ groups: user.groups });
    } catch (error) {
        res.status(400).json({ error });
    }
};

const deleteGroup = async (req, res) => {
    const { id } = req.params;
    try {
        await Group.deleteOne({ _id: id })
        await GroupMessage.deleteOne({ groupId: id })

        return res.status(200).json({ message: 'Delete group successfully', group: { id } })
    } catch (error) {
        return res.status(400).json({ error })
    }
}

module.exports = {
    createGroup,
    addNewUserToGroup,
    getGroups,
    deleteGroup
};
