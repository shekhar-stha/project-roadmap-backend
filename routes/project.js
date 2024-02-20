const route = require("express").Router()
const Projects = require('../models/Projects')
const ProjectFiles = require('../models/ProjectFiles')
const ProjectComments = require('../models/ProjectComments')
const Users = require("../models/Users")
const auth = require("../middleware/auth")
const Notifications = require("../models/Notifications")
const AssignedProjects = require("../models/AssignedProjects")

// register user
route.post("/createProject", auth.verifyUser, async (req, res) => {

    try {
        const assignedBy = userData.id;
        const { name, description, projectType, projectStatus, notes, deadline, githubLink, vercelLink, niftyLink, completionStatus, assignedTo } = req.body;


        const assignedByUser = await Users.findByPk(assignedBy);
        if (!assignedByUser) {
            return res.status(400).json({
                msg: "Invalid user ID in assignedBy",
                status: false,
            });
        }

        const assignedToUsers = await Users.findAll({
            where: {
                id: assignedTo,
            },
        });

        if (assignedToUsers.length !== assignedTo.length) {
            return res.status(400).json({
                msg: "Invalid user IDs in assignedTo",
                status: false,
            });
        }

        const project = await Projects.create({
            name,
            description,
            projectType,
            projectStatus,
            notes,
            githubLink,
            vercelLink,
            niftyLink,
            completionStatus,
            assignedBy,
            deadline
        });

        const projectId = project.id;

        const userProjectsData = assignedTo.map(userId => ({
            assignedTo: userId,
            projectId
        }));

        console.log(userProjectsData, 'userProjectsData')

        await AssignedProjects.bulkCreate(userProjectsData);

        const notificationsData = assignedToUsers.map((user) => ({
            notificationType: 'project',
            notificationTypeId: projectId,
            notificationData: `New Project: "${name}" assigned to you`,
            seen: '0',
            title: name,
            description: description,
            belongsTo: user.id,
        }));

        await Notifications.bulkCreate(notificationsData);

        const newProject = await Projects.findByPk(projectId, {
            include: [{
                model: Users,
                as: 'assignedToUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp', 'assignedProjects'] }
            },
            {
                model: Users,
                as: 'assignedByUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
            }],
        });

        res.status(200).json({
            data: newProject,
            status: true
        })
    }
    catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        })
    }
})

route.put("/editProject/:projectId", async (req, res) => {
    try {
        const projectId = req.params.projectId;
        console.log(projectId, 'projectId')
        const { assignedTo, ...projectData } = req.body;

        const project = await Projects.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ msg: "Project not found" });
        }

        await project.update(projectData);

        const assignedProjects = await AssignedProjects.findAll({
            where: { projectId },
        });

        console.log(assignedProjects)

        const userProjectsData = assignedTo.map(userId => ({
            assignedTo: userId,
            projectId
        }));

        await AssignedProjects.destroy({
            where: { projectId },
        });

        await AssignedProjects.bulkCreate(userProjectsData);

        console.log(userProjectsData, 'userProjectsData')

        const newProject = await Projects.findByPk(projectId, {
            include: [{
                model: Users,
                as: 'assignedToUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp', 'assignedProjects'] }
            },
            {
                model: Users,
                as: 'assignedByUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
            }],
        });

        res.status(200).json({
            data: newProject,
            status: true
        })
    }
    catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        })
    }
});


route.get("/getProjects", auth.verifyUser, async (req, res) => {
    try {
        const data = await Projects.findAll({
            include: [{
                model: Users,
                as: 'assignedToUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
            },
            {
                model: Users,
                as: 'assignedByUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
            }],
            order: [['id', 'DESC']]
        });
        res.status(200).json({ data: data, status: true })
    }
    catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        })
    }
})



route.get("/getProject/:projectId", auth.verifyUser, async (req, res) => {
    try {
        const data = await Projects.findOne(
            {
                where: { id: req.params.projectId },
                include: [{
                    model: Users,
                    as: 'assignedToUser',
                    attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
                },
                {
                    model: Users,
                    as: 'assignedByUser',
                    attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
                }],
                order: [['id', 'DESC']]
            });
        res.status(200).json({ data: data, status: true })
    }
    catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        })
    }
})

route.get("/projectsAssignedTo/:userId", auth.verifyUser, async (req, res) => {
    try {
        const userId = userData.id;
        const projects = await Projects.findAll({
            where: {
                assignedTo: {
                    [Sequelize.Op.contains]: [userId],
                },
            },
        });

        res.status(200).json({
            data: projects,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false,
        });
    }
});

module.exports = route;