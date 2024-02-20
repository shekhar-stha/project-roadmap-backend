const route = require("express").Router()
const TaskTemplates = require('../models/TaskTemplates')
const TemplateTasks = require('../models/TemplateTasks')
const auth = require("../middleware/auth")

// Task Template
route.post("/createTaskTemplate", auth.verifyUser, async (req, res) => {
    try {
        const { tasks, templateName } = req.body;

        console.log("tasks:", tasks);

        if (!templateName) {
            return res.status(400).json({
                msg: "Please provide a template name",
                status: false,
            });
        }

        const taskTemplate = await TaskTemplates.create({
            templateName,
        });

        const tasksData = tasks.map(task => ({
            ...task,
            completionStatus: 'to-do',
            templateGroupID: taskTemplate.id,
        }));

        await TemplateTasks.bulkCreate(tasksData);

        const newTemplate = await TaskTemplates.findOne({
            where: {
                id: taskTemplate.id
            },
            include: [{
                model: TemplateTasks,
            }],
        });

        res.status(200).json({
            data: newTemplate,
            status: true
        });
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        });
    }
})

route.get("/getTaskTemplates", auth.verifyUser, async (req, res) => {
    try {

        const templates = await TaskTemplates.findAll({
            include: [{
                model: TemplateTasks,
            }],
        });

        res.status(200).json({
            data: templates,
            status: true
        });
    } catch (error) {
        res.status(500).json({
            msg: error?.message,
            status: false
        });
    }
})
module.exports = route;