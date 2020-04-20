const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmpty = require("validator/lib/isEmpty");
const isEmail = require("validator/lib/isEmail");
const { User } = require("../../../models/User");
const { promisify } = require("util");

const hashPass = promisify(bcrypt.hash);

const createToken = async payload => {
    try {
        const token = await jwt.sign(payload, "fd@fd!/fd?21?A", { expiresIn: "24d" });
        return token;
    } catch (err) {
        return res.status(500).json({ err });
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
        if (password !== confirmPassword) errors.confirmPassword = "password and confirmPassword does not match";
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

    const user = await User.findOne({ email }).select(["id", "email", "password", "name"]);
    console.log(user.id);
    if (!user) return res.status(500).json({ error: "email does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ error: "password does not match" });

    const { id, name } = user;
    console.log(user);

    const token = await createToken({ id, email, name });
    return res.status(200).json({
        token,
        user: {
            id,
            email,
            name
        }
    });
};

const updateAvatar = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ error: "User not found" });
        user.avatar = req.file.location;
        return res.status(200).json({ file: req.file.location });
    } catch (error) {
        return res.status(400).json({ error });
    }
};

module.exports = {
    createUser,
    signIn,
    updateAvatar
};
