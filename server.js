const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const notificationRoutes = require('./routes/notification');
const messageRoutes = require('./routes/message');
const announcementRoutes = require('./routes/announcement');
const taskRoutes = require('./routes/task');
const taskTemplates = require('./routes/taskTemplate');
const VideoPlaylists  = require('./routes/videoPlaylist');
const Notifications = require('./routes/notification');

require('dotenv').config();
require("./db/conn")
require('./db/relation')


const PORT = process.env.PORT;
const app = express();


app.use(express.json());
app.use("/api/img",express.static("img"))

// Enable CORS with specific options
app.use(cors({
    origin: '*',  // Allow requests from this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,  // Allow credentials (cookies, HTTP authentication) to be sent with the request
  }));
  


// Routes
app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/taskTemplate', taskTemplates);
app.use('/api/videoPlaylist', VideoPlaylists);
app.get('/api/notification', Notifications);


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})