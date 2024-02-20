const Announcements = require("../models/Announcements")
const MessageAttachments = require("../models/MessageAttachments")
const Messages = require("../models/Messages")
const Notifications = require("../models/Notifications")
const PlaylistVideos = require("../models/PlaylistVideos")
const ProjectComments = require("../models/ProjectComments")
const ProjectFiles = require("../models/ProjectFiles")
const Projects = require("../models/Projects")
const TaskComments = require("../models/TaskComments")
const TaskFiles = require("../models/TaskFiles")
const Tasks = require("../models/Tasks")
const TaskTemplates = require("../models/TaskTemplates")
const TemplateTasks = require("../models/TemplateTasks")
const Users = require("../models/Users")
const VideoPlaylists = require("../models/VideoPlaylists")
const AssignedProjects = require("../models/AssignedProjects")
// Messages
Users.hasMany(Messages, { foreignKey: "senderID" })
Messages.belongsTo(Users, { foreignKey: "senderID" })

Users.hasMany(Messages, { foreignKey: "receiverID" })
Messages.belongsTo(Users, { foreignKey: "receiverID" })

Messages.hasMany(MessageAttachments, { foreignKey: "messageID" })
MessageAttachments.belongsTo(Messages, { foreignKey: "messageID" })

// Projects
Users.hasMany(Projects, { foreignKey: "assignedBy" })
Projects.belongsTo(Users, {
    as: 'assignedByUser',
    foreignKey: "assignedBy"
})

// Users.hasMany(Projects, { foreignKey: "assignedTo" })
// Projects.belongsTo(Users, {
//     as: 'assignedToUser',
//     foreignKey: "assignedTo"
// })

Users.belongsToMany(Projects, { through: 'assignedProjects', as: 'assignedToUser' , foreignKey: 'assignedTo' });
Projects.belongsToMany(Users, { through: 'assignedProjects', as: 'assignedToUser', foreignKey: 'projectId' });


Projects.hasMany(Tasks, { foreignKey: "projectId", allowNull: true });
Tasks.belongsTo(Projects, { foreignKey: "projectId", allowNull: true });

Users.hasMany(ProjectComments, { foreignKey: "userID" })
ProjectComments.belongsTo(Users, { foreignKey: "userID" })

Projects.hasMany(ProjectComments, { foreignKey: "projectID" })
ProjectComments.belongsTo(Projects, { foreignKey: "projectID" })

ProjectComments.hasMany(ProjectFiles, { foreignKey: "projectCommentID", allowNull: true });
ProjectFiles.belongsTo(ProjectComments, { foreignKey: "projectCommentID", allowNull: true });

Users.hasMany(ProjectFiles, { foreignKey: "userID" })
ProjectFiles.belongsTo(Users, { foreignKey: "userID" })

Projects.hasMany(ProjectFiles, { foreignKey: "projectID" })
ProjectFiles.belongsTo(Projects, { foreignKey: "projectID" })

// VideoPlaylists
Users.hasMany(VideoPlaylists, { foreignKey: "createdBy" })
VideoPlaylists.belongsTo(Users, { foreignKey: "createdBy" })

VideoPlaylists.hasMany(PlaylistVideos, { foreignKey: "playlistID" })
PlaylistVideos.belongsTo(VideoPlaylists, { foreignKey: "playlistID" })

// Tasks
Users.hasMany(Tasks, { foreignKey: "assignedBy" })
Tasks.belongsTo(Users, {
    as: 'assignedByUser',
    foreignKey: "assignedBy"
})

Users.hasMany(Tasks, { foreignKey: "assignedTo" })
Tasks.belongsTo(Users, {
    as: 'assignedToUser',
    foreignKey: "assignedTo"
})

Tasks.hasMany(TaskComments, { foreignKey: "taskID" })
TaskComments.belongsTo(Tasks, { foreignKey: "taskID" })

TaskComments.hasMany(TaskFiles, { foreignKey: "taskCommentID", allowNull: true });
TaskFiles.belongsTo(TaskComments, { foreignKey: "taskCommentID", allowNull: true });

Users.hasMany(TaskComments, { foreignKey: "userID" })
TaskComments.belongsTo(Users, { foreignKey: "userID" })

Users.hasMany(TaskFiles, { foreignKey: "userID" })
TaskFiles.belongsTo(Users, { foreignKey: "userID" })

Tasks.hasMany(TaskFiles, { foreignKey: "taskId" })
TaskFiles.belongsTo(Tasks, { foreignKey: "taskId" })


// Template Tasks
Users.hasMany(TemplateTasks, { foreignKey: "assignedBy" })
TemplateTasks.belongsTo(Users, { foreignKey: "assignedBy" })

Users.hasMany(TemplateTasks, { foreignKey: "assignedTo" })
TemplateTasks.belongsTo(Users, { foreignKey: "assignedTo" })

TaskTemplates.hasMany(TemplateTasks, { foreignKey: "templateGroupID" })
TemplateTasks.belongsTo(TaskTemplates, { foreignKey: "templateGroupID" })

// Notifications
Users.hasMany(Notifications, { foreignKey: "belongsTo" })
Notifications.belongsTo(Users, { foreignKey: "belongsTo" })

// Announcements
Users.hasMany(Announcements, { foreignKey: "createdBy" })
Announcements.belongsTo(Users, { foreignKey: "createdBy" })

