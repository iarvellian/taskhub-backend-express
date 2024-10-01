require ('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Enable CORS as middleware for your frontend
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api/v1', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/projects', projectRoutes);

const port = 5000;
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});