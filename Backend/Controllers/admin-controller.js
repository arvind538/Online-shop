const User = require("../models/user-model");
const Contact = require("../models/contact-model");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        // console.log(users);

        if (!users || users.length === 0) {
            return res.status(400).json({ message: "No User Found" })
        }
        return res.status(200).json(users);

    } catch (error) {
        next(error);
    }
}

// deleteUserById logic

const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        await User.deleteOne({ _id: id });
        return res.status(200).json({ message: "User Deleted Successfully!" });
    } catch (error) {
        next(error);
    }
}
// getUserById logic 
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await User.findOne({ _id: id }, { password: 0 });
        return res.status(201).json(data);
    } catch (error) {
        next(error);
    }
}
// updateUserById
const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateUserData = req.body;
        const updatedData = await User.updateOne(
            { _id: id },
            {
                $set: updateUserData,
            }
        );
        return res.status(200).json(updatedData);
    } catch (error) {
        next(error);
    }
}

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        // console.log(contacts);
        if (!contacts || contacts.length === 0) {
            return res.status(401).json({ message: "No Contact Found" });
        }
        return res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
}
module.exports = { getAllUsers, getAllContacts, deleteUserById, getUserById, updateUserById }