const jwt = require('jsonwebtoken')
const Users = require('../models/Users')

const generateErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ msg: message, status: false });
};

const verifyAdmin = async (req, res, next) => {
    try {
        console.log(req)
        const token = req?.headers?.authorization?.split(" ")[1]

        console.log("token", token)
        if (!token) res.status(400).send({
            msg: "You need to login first.",
            status: false
        })

        try {
            const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY)
            console.log(verifyUser, process.env.JWT_SECRET_KEY)

            if (verifyUser.userType === 'admin') {

                const userExists = await checkUserExists(verifyUser.id);
                if (!userExists) {
                    return generateErrorResponse(res, 404, "User not found in the database.");
                }

                userData = verifyUser
                next()
            }
            else {
                res.status(404).json({
                    msg: "You aren't authorized",
                    status: false
                })
            }
        } catch (error) {
            res.status(404).json({
                msg: "You aren't authorized",
                status: false
            })
        }
    } catch (error) {
        res.status(500).json(error?.message)
    }
}

const verifyUser = async (req, res, next) => {
    try {
        const token = req?.headers?.authorization?.split(" ")[1];

        if (!token) res.status(400).send({
            msg: "You need to login first.",
            status: false
        })

        try {
            const verifyUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log(verifyUser, process.env.JWT_SECRET_KEY);

            // Allow all user types
            if (verifyUser.userType === 'admin' || verifyUser.userType === 'supportAssistant' || verifyUser.userType === 'developer' || verifyUser.userType === 'superadmin') {

                const userExists = await checkUserExists(verifyUser.id);
                if (!userExists) {
                    return generateErrorResponse(res, 404, "User not found in the database.");
                }

                userData = verifyUser;
                next();
            } else {
                res.status(404).json({
                    msg: "You aren't authorized",
                    status: false
                })
            }
        } catch (error) {
            res.status(404).json({
                msg: "You aren't authorized",
                status: false
            })
        }
    } catch (error) {
        res.status(500).json(error?.message);
    }
};

const checkUserExists = async (userId) => {
    try {
        const user = await Users.findByPk(userId);
        return user !== null;
    } catch (error) {
        console.error("Error checking user existence:", error);
        return false;
    }
};

module.exports = {
    verifyAdmin, verifyUser
};