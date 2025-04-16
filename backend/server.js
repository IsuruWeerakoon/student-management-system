const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();
const port = process.env.SERVER_PORT || 3001;

const authRoutes = require('./routes/authRoute.js');
const studentRoutes = require('./routes/studentRoute.js');
const courseRoutes = require('./routes/courseRoute.js');
const enrollmentRoutes = require('./routes/enrollmentRoute.js');
const examRoute = require('./routes/examRoute.js');
const resultRoute = require('./routes/resultRoute.js');
const teacherRoute = require('./routes/teacherRoute.js');
const messageRoute = require('./routes/messageRoute.js');
const timetableRoutes = require('./routes/timetableRoute.js');
const adminsRoute = require('./routes/adminRoute.js');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware setup
const allowedOrigins = ['http://localhost:5173', 'http://192.168.1.2:5173', 'http://192.168.1.3:5173'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,  // Allow cookies and authentication headers
  }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', adminsRoute);
app.use('/api', studentRoutes);
app.use('/api', studentRoutes);
app.use('/api', courseRoutes);
app.use('/api', enrollmentRoutes);
// app.use('/api/exams', examRoute);
app.use('/api', examRoute);
// app.use('/api/results', resultRoute);
app.use('/api', resultRoute);
app.use('/api', teacherRoute);
app.use('/api', messageRoute);
// app.use('/api/timetable', timetableRoutes);
app.use('/api', timetableRoutes);



//Test API for the BackEnd
app.get('/', function(req, res){
  res.json("Test API from the BACKEND");
});

// Start the server
app.listen(port, '0.0.0.0', function(){
    console.log('Server is running on PORT:'+port);
});