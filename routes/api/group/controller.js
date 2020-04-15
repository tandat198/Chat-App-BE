const { Group } = require("../../../models/Group");
const GroupMessage = require("../../../models/GroupMessage");
const { User } = require("../../../models/User");

const getGroupsOfUser = async (req, res) => {
    const { email } = req.user;
    try {
        const user = await User.findOne({ email });
        const groupsOfUser = user.groups;
        const resGroups = [];
        for (let group of groupsOfUser) {
            resGroups.push(group.transform());
        }
        return res.status(200).json({ groups: resGroups });
    } catch (error) {
        res.status(400).json({ error });
    }
};

const getUsersInGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await Group.findById(id);
        const usersInGroup = group.users;
        const users = await User.where("_id").in(usersInGroup).select(["id", "name", "email"]);
        const resUser = [];

        for (let user of users) {
            resUser.push(user.transform());
        }

        return res.status(200).json({ users: resUser });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

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
            groupId: group.id
        });
        user.groups.push(group);
        await Promise.all([group.save(), groupMessage.save(), user.save()]);
        return res.status(201).json({ group: group.transform() });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const addNewUserToGroup = async (req, res) => {
    const { groupId, email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User does not exist" });
        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ error: "Group not found" });

        const usersInGroup = group.users;
        const duplicateUser = usersInGroup.find(id => id === user.id);
        if (duplicateUser) return res.status(500).json({ error: "User is already in this group" });

        group.users.push(user.id);
        user.groups.push(group);
        await Promise.all([group.save(), user.save()]);

        const resUser = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        return res.status(200).json({ user: resUser });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

const deleteGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const group = await Group.findById(id);
        const usersInGroup = group.users;

        let promiseList = [];
        for (let i = 0; i < usersInGroup.length; i++) {
            promiseList.push(User.findById(usersInGroup[i]));
        }
        const userList = await Promise.all(promiseList);

        for (let i = 0; i < userList.length; i++) {
            userList[i].groups.pull({ id });
        }

        await Promise.all(userList.map(user => user.save()));
        await Promise.all([GroupMessage.deleteOne({ groupId: id }), Group.deleteOne({ _id: id })]);

        return res.status(200).json({ message: "Delete group successfully", group: group.transform() });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

module.exports = {
    getGroupsOfUser,
    getUsersInGroup,
    createGroup,
    addNewUserToGroup,
    deleteGroup
};
