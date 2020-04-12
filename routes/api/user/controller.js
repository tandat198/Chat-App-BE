const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmpty = require("validator/lib/isEmpty");
const isEmail = require("validator/lib/isEmail");
const { User } = require("../../../models/User");
const { promisify } = require("util");

const hashPass = promisify(bcrypt.hash);

const createToken = async payload => {
    try {
        const token = await jwt.sign(payload, "fd@fd!/fd?", { expiresIn: "3h" });
        return token;
    } catch (err) {
        return res.status(500).json({ err });
    }
};

const createUser = async (req, res) => {
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
    if (Object.keys(errors).length) return res.status(500).json(errors);

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ email: "Email already exists" });
    try {
        const hash = await hashPass(password, 10);
        const user = new User({
            email,
            name,
            password: hash
        });
        await user.save();
        const { _id } = user;
        const token = await createToken({ email, name, _id });
        return res.status(201).json({ token, user: { email, name, _id } });
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

    const user = await User.findOne({ email });
    if (!user) return res.status(500).json({ error: "email does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ error: "password does not match" });

    const { _id, name, groups } = user;

    const token = await createToken({ email, _id, name });
    return res.status(200).json({
        user: {
            email,
            _id,
            name
        },
        groups,
        token
    });
};

module.exports = {
    createUser,
    signIn
};
