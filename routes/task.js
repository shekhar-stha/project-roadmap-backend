const route = require("express").Router()
const Tasks = require('../models/Tasks')
const TaskComments = require('../models/TaskComments')
const Users = require("../models/Users")
const Notifications = require("../models/Notifications")
const auth = require("../middleware/auth")
const Projects = require("../models/Projects")
const TaskTemplates = require("../models/TaskTemplates")
const TemplateTasks = require("../models/TemplateTasks")
const TaskFiles = require("../models/TaskFiles")

// route.post("/createTask", auth.verifyUser, async (req, res) => {

//     try {
//         const assignedBy = userData.id;
//         const { assignedTo } = req.body;

//         console.log("assignedBy:", assignedBy);
//         console.log("assignedTo:", assignedTo);

//         const assignedByUser = await Users.findByPk(assignedBy);
//         const assignedToUsers = await Users.findAll({
//             where: {
//                 id: assignedTo,
//             },
//         });


//         if (!assignedByUser || assignedToUsers.length !== assignedTo.length) {
//             return res.status(400).json({
//                 msg: "Invalid user IDs in assignedBy or assignedTo",
//                 status: false,
//             });
//         }

//         const tasksData = assignedToUsers.map((user) => ({
//             ...req.body, assignedTo: user.id, assignedBy: userData.id,
//         }));

//         const tasksResponse = await Tasks.bulkCreate(tasksData);

//         console.log(tasksResponse, "Tasks Response")

//         const taskIds = tasksResponse.map(task => task.id);

//         const notificationsData = tasksResponse.map((task) => ({
//             notificationType: 'task',
//             notificationTypeId: task.id,
//             notificationData: `New Task: "${task.title}" assigned to you`,
//             seen: '0',
//             title: task.title,
//             description: task.description,
//             belongsTo: task.assignedTo,
//         }));

//         await Notifications.bulkCreate(notificationsData);

//         const newTasks = await Tasks.findAll({
//             where: {
//                 id: taskIds
//             },
//             include: [{
//                 model: Users,
//                 as: 'assignedToUser',
//                 attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
//             },
//             {
//                 model: Users,
//                 as: 'assignedByUser',
//                 attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
//             }],
//         });

//         res.status(200).json({
//             data: newTasks,
//             status: true
//         })
//     }
//     catch (error) {
//         res.status(500).json({
//             msg: error?.message,
//             status: false
//         })
//     }
// })

route.post("/createTasks", auth.verifyUser, async (req, res) => {
    try {
        const assignedBy = userData.id;
        const { tasks, assignedTo, projectId } = req.body;

        console.log("assignedBy:", assignedBy);
        console.log("assignedTo:", assignedTo);
        console.log("project:", projectId);
        console.log("tasks:", tasks);

        const assignedByUser = await Users.findByPk(assignedBy);
        const assignedToUser = await Users.findByPk(assignedTo);

        if (!assignedByUser) {
            return res.status(400).json({
                msg: "Invalid user IDs in assignedBy",
                status: false,
            });
        }

        if (!assignedToUser) {
            return res.status(400).json({
                msg: "Invalid user IDs in assignedTo",
                status: false,
            });
        }

        const tasksData = tasks.map(task => ({
            ...task,
            completionStatus: 'to-do',
            assignedTo,
            assignedBy,
            projectId,
        }));

        const tasksResponse = await Tasks.bulkCreate(tasksData);

        console.log(tasksResponse, "Tasks Response")

        const taskIds = tasksResponse.map(task => task.id);

        const notificationsData = tasksResponse.map(task => ({
            notificationType: 'task',
            notificationTypeId: task.id,
            notificationData: `New Task: "${task.title}" assigned to you`,
            seen: '0',
            title: task.title,
            description: task.description,
            belongsTo: task.assignedTo,
        }));

        await Notifications.bulkCreate(notificationsData);

        const newTasks = await Tasks.findAll({
            where: {
                id: taskIds
            },
            include: [{
                model: Users,
                as: 'assignedToUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp', 'createdAt', 'updatedAt'] }
            },
            {
                model: Users,
                as: 'assignedByUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp', 'createdAt', 'updatedAt'] }
            },
            {
                model: Projects,
                as: 'project',
                attributes: ['id', 'name']
            }],
        });

        res.status(200).json({
            data: newTasks,
            status: true
        });
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        });
    }
});


route.get("/getAllTasks", auth.verifyUser, async (req, res) => {
    try {
        const data = await Tasks.findAll({
            include: [{
                model: Users,
                as: 'assignedToUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
            },
            {
                model: Users,
                as: 'assignedByUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
            },
            {
                model: Projects,
                as: 'project',
                attributes: ['id', 'name']
            }],
        });

        res.status(200).json({
            data: data,
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

route.get("/getTask/:taskId", auth.verifyUser, async (req, res) => {
    try {
        const data = await Tasks.findOne({
            where: { id: req.params.taskId },
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
        });

        res.status(200).json({
            data: data,
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


route.get("/getProjectTasks/:projectId", auth.verifyUser, async (req, res) => {
    try {
        const data = await Tasks.findAll({
            where: { projectId: req.params.projectId },
            include: [{
                model: Users,
                as: 'assignedToUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
            },
            {
                model: Users,
                as: 'assignedByUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp'] }
            },
            {
                model: Projects,
                as: 'project',
                attributes: ['id', 'name']
            }],
        });

        res.status(200).json({
            data: data,
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

route.get("/getUsersTasks", auth.verifyUser, async (req, res) => {
    try {
        console.log(userData.id, "userData.id")
        const data = await Tasks.findAll({
            where: { assignedTo: userData.id },
            include: [{
                model: Users,
                as: 'assignedToUser',
                attributes: ['id', 'fullName', 'email', 'photo']
            },
            {
                model: Users,
                as: 'assignedByUser',
                attributes: ['id', 'fullName', 'email', 'photo']
            },
            {
                model: Projects,
                as: 'project',
                attributes: ['id', 'name']
            },
            ],
        });

        res.status(200).json({
            data: data,
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

route.put("/editTask/:taskId", auth.verifyUser, async (req, res) => {
    try {
        const data = await Tasks.update(req.body, {
            where: { id: req.params.taskId }
        });

        const updatedTask = await Tasks.findOne({
            where: {
                id: req.params.taskId
            },
            include: [{
                model: Users,
                as: 'assignedToUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp', 'createdAt', 'updatedAt'] }
            },
            {
                model: Users,
                as: 'assignedByUser',
                attributes: { exclude: ['password', 'confirmPassword', 'loginIp', 'createdAt', 'updatedAt'] }
            },
            {
                model: Projects,
                as: 'project',
                attributes: ['id', 'name']
            }],
        });

        res.status(200).json({
            data: updatedTask,
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

route.post("/addTaskComment/:id", auth.verifyUser, async (req, res) => {
    try {
        const userId = userData.id;
        const commentText = req.body.commentText;

        console.log(userId, "userId")
        console.log(commentText, "commentText")
        console.log(req.params.id, "task id")
        const task = await Tasks.findByPk(req.params.id);

        if (!task) {
            return res.status(400).json({
                msg: "Task not found",
                status: false,
            });
        }

        if (!commentText) {
            return res.status(400).json({
                msg: "Please provide a comment",
                status: false,
            });
        }

        const data = await TaskComments.create({ commentText, userID: userId, taskID: req.params.id });

        const comment = await TaskComments.findOne({
            where: {
                id: data.id
            },
            include: [{
                model: TaskFiles
            }],
        });

        res.status(200).json({
            data: data,
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

route.get("/getTaskComments/:id", auth.verifyUser, async (req, res) => {
    try {
        const data = await TaskComments.findAll({
            where: { taskID: req.params.id },
            include: [{
                model: Users,
                attributes:['id', 'fullName', 'email', 'photo']
            },
            {
                model: TaskFiles
            }],
        });

        res.status(200).json({
            data: data,
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

module.exports = route;