const User = require("../models/user-model");
const bcrypt = require("bcrypt");

// home page
const home = async (req, res) => {
    try {
        res
            .status(201)
            .json("send the data home page successfully!");
    } catch (error) {
        console.log(error);
    }
}
// register page
const register = async (req, res) => {
    try {
        // console.log(req.body);
        const { username, email, phone, password } = req.body;
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "email already exist" });

        }
        const userCreated = await User.create({
            username, email, phone, password
        });

        res.status(201).json({
            msg: userCreated, token: await userCreated.generateToken(), userId: userCreated._id.toString(),
        });
    } catch (error) {
        // res.status(500).json("internal server error");
        next(error);
    }
};
// login page--------
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userExist = await User.findOne({ email });
        // console.log(userExist);

        if (!userExist) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }


        const user = await userExist.comparePassword(password);

        if (user) {
            res.status(200).json({
                msg: userExist,
                token: await userExist.generateToken(),
                userId: userExist._id.toString(),
            });
        } else {
            res.status(401).json({ message: "Invalid emails or password" });
        }


    } catch (error) {
        res.status(500).json("internal server error");
    }
}
// user schema 
const user = async (req, res) => {
    try {
        const userdata = req.user;
        // console.log(userdata);
        res.status(200).json({ userdata });
    } catch (error) {
        console.log(`error from the user data ${error}`);

    }
}
module.exports = { home, register, login, user };
