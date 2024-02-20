const route = require("express").Router()
const Users = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const upload = require('../middleware/fileUpload')
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

// register user
route.post("/addUser", upload.single("photo"), async (req, res) => {
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword
    const { username, email } = req.body;
    try {
        const existingUsername = await Users.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(400).json({
                msg: "Username already exists",
                status: false
            });
        }

        // Check if email already exists
        const existingEmail = await Users.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({
                msg: "Email already exists",
                status: false
            });
        }
        if (password === confirmPassword) {
            const salt = bcrypt.genSaltSync(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const hashConfirmPassword = await bcrypt.hash(confirmPassword, salt)

            const photoPath = req.file ? req.file.path : null;

            const data = await Users.create({
                ...req.body,
                password: hashPassword,
                confirmPassword: hashConfirmPassword,
                photo: photoPath,
            })

            res.status(200).json({
                data: data.dataValues,
                status: true
            })
        }
        else {
            res.status(400).json({
                msg: "Password didn't match",
                status: false
            })
        }
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        })
    }
})


// Login User
route.post("/login", async (req, res) => {

    console.log(req.body)
    const username = req.body.username
    const password = req.body.password

    try {
        const data = await Users.findOne({ where: { username: username } })
        console.log(data)
        const passwordReq = data.dataValues.password
        const comparePw = await bcrypt.compare(password, passwordReq)
        if (!comparePw) {
            res.status(400).json({
                msg: "User name and password didn't match",
                status: false
            })
        } else {
            const token = jwt.sign({
                id: data.id,
                userType: data.userType
            }, process.env.JWT_SECRET_KEY)

            const dataNeeded = {
                id: data.dataValues.id,
                username: data.dataValues.username,
                userType: data.dataValues.userType,
                fullName: data.dataValues.fullName,
                photo: data.dataValues.photo,
                email: data.dataValues.email,
            }

            res.status(200).cookie('token', token, { maxAge: 25920000000 }).json({ data: dataNeeded, status: true, token })
        }

    } catch (error) {
        res.status(500).json(
            {
                msg: "User name and password didn't match",
                status: false
            }
        )
    }
})


// Show User
route.get("/getUsers", auth.verifyUser, async (req, res) => {
    try {
        const data = await Users.findAll({
            attributes: {
                exclude: ['password', 'confirmPassword', 'loginIp'],
            },
        });
        res.status(200).json({ data: data, status: true })
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        })
    }
})

route.get("/getUsers/developers", auth.verifyAdmin, async (req, res) => {
    try {
        const data = await Users.findAll({
            where: { userType: "developer" },
            attributes: {
                exclude: ['password', 'confirmPassword', 'loginIp'],
            },
        });
        res.status(200).json({ data: data, status: true })
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        })
    }
})

route.get("/getUsers/supportAssistants", auth.verifyAdmin, async (req, res) => {
    try {
        const data = await Users.findAll({
            where: { userType: "supportAssistant" },
            attributes: {
                exclude: ['password', 'confirmPassword', 'loginIp'],
            },
        });
        res.status(200).json({ data: data, status: true })
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        })
    }
})

route.get("/getUser/:userId", auth.verifyUser, async (req, res) => {
    try {
        const data = await Users.findOne({
            where: { id: req.params.userId },
            attributes: {
                exclude: ['password', 'confirmPassword', 'loginIp'],
            },
        });
        res.status(200).json({ data: data, status: true })
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        })
    }
})

// Updating Profile Picture
route.put("/updatePhoto/:userId", auth.verifyUser, upload.single("photo"), async (req, res) => {
    try {
        const userId = userData.id;
        console.log("user id", userId)
        // Check if the user exists
        const existingUser = await Users.findOne({ where: { id: userId } });
        if (!existingUser) {
            return res.status(404).json({
                msg: "User not found",
                status: false
            });
        }

        if (existingUser.photo) {
            const previousPhotoPath = path.join(__dirname, '../img', existingUser.photo);

            await fs.rm(`${previousPhotoPath}`, { force: true });
        }

        // Update the user's photo
        console.log(req.file)
        const photoPath = req.file ? req.file.filename : null;
        if (!photoPath) {
            return res.status(400).json({
                msg: "Please provide a photo",
                status: false
            });
        }
        await existingUser.update({ photo: photoPath });

        res.status(200).json({
            msg: "Profile picture updated successfully",
            status: true,
            photo: photoPath
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Internal Server Error",
            status: false
        });
    }
});


// update user
// route.put("/updateUser", auth.verifyUser, async (req, res) => {
//     try {
//         await User.update(req.body, { where: { id: userData.id } });
//         const updatedData = await User.findOne({ where: { id: userData.id } });
//         const data = { id: updatedData.id, username: updatedData.username, role: updatedData.role, full_name: updatedData.full_name, phone_number: updatedData.phone_number, email: updatedData.email }
//         res.status(200).json(data)
//     } catch (error) {
//         console.log(error)
//         res.status(500).json(error.errors[0].message)
//     }
// })

module.exports = route;