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
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: "User does not exist" });
        const group = await Group.findById(groupId);
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
        const group = await Group.findById(id)
        const usersInGroup = group.users;

        let promiseList = [];
        for (let i = 0; i < usersInGroup.length; i++) {
            promiseList.push(User.findById(usersInGroup[i]))
        }
        const userList = await Promise.all(promiseList);

        for (let i = 0; i < userList.length; i++) {
            userList[i].groups.pull({ _id: id })
        }

        await Promise.all(userList.map(user => user.save()));
        await Promise.all([GroupMessage.deleteOne({ groupId: id }), Group.deleteOne({ _id: id })])

        return res.status(200).json({ message: 'Delete group successfully', group })
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
