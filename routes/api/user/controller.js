const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmpty = require("validator/lib/isEmpty");
const isEmail = require("validator/lib/isEmail");
const { User } = require("../../../models/User");
const { promisify } = require("util");
const { secretKey } = require("../../../config");

const hashPass = promisify(bcrypt.hash);

const createToken = async payload => {
    try {
        const token = await jwt.sign(payload, secretKey, { expiresIn: "2h" });
        return token;
    } catch (error) {
        return res.status(500).json({ error });
    }
};

const createUser = async (req, res) => {
    try {
        const validatedFields = ["email", "password", "confirmPassword", "name"];
        let errors = {};
        const reqBody = req.body;
        const { email, name, password, confirmPassword } = reqBody;

        for (let field of validatedFields) {
            if (!reqBody[field]) errors[field] = `Please enter your ${field}`;
        }
        if (Object.keys(errors).length) return res.status(500).json(errors);

        if (password.length < 8) errors.password = "Password is too weak";
        if (password !== confirmPassword) errors.confirmPassword = "Password and confirmPassword does not match";
        if (!isEmail(email)) errors.email = "Email is not valid";
        if (Object.keys(errors).length) return res.status(500).json({ error: errors });

        const user = await User.findOne({ email });
        if (user) {
            errors.email = "Email already exists";
            return res.status(400).json({ error: errors });
        }
        const hash = await hashPass(password, 10);

        const newUser = new User({
            email,
            name,
            password: hash
        });
        await newUser.save();
        const { id } = newUser;
        const token = await createToken({ id, email, name });
        return res.status(201).json({ token, user: { id, email, name } });
    } catch (error) {
        res.status(400).json({ error });
    }
};

const signIn = async (req, res) => {
    const validatedFields = ["email", "password"];
    const errors = {};
    const { email, password } = req.body;
    for (let field of validatedFields) {
        if (isEmpty(req.body[field])) errors[field] = `${field} is required`;
    }
    if (Object.keys(errors).length) return res.status(500).json(errors);

    const user = await User.findOne({ email }).select(["id", "email", "password", "name", "profilePhoto", "coverPhoto"]);
    if (!user) return res.status(500).json({ error: "Email does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ error: "Password does not match" });

    const resData = {};
    const resColumns = ["id", "email", "name", "coverPhoto", "profilePhoto"];
    for (let col of resColumns) {
        resData[col] = user[col];
    }

    const token = await createToken(resData);
    return res.status(200).json({
        token,
        user: resData
    });
};

const updateProfilePhoto = async (req, res) => {
    try {
        const { id } = req.user;
        const { linkUrl } = req.body;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.profilePhoto = linkUrl;
        await user.save();
        return res.status(200).json({ linkUrl, message: "Update profile photo successfully" });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

const updateCoverPhoto = async (req, res) => {
    try {
        const { id } = req.user;
        const { linkUrl } = req.body;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.coverPhoto = linkUrl;
        await user.save();
        return res.status(200).json({ linkUrl, message: "Update cover photo successfully" });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

module.exports = {
    createUser,
    signIn,
    updateProfilePhoto,
    updateCoverPhoto
};
