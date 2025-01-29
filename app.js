require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http"); // Import the HTTP module
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const teamRoutes = require("./routes/teamRoutes");
const teammemberRoutes = require("./routes/teammemberRoutes");

const app = express();

// Create an HTTP server instance
const server = http.createServer(app);

// Enable CORS and other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use("/api/v1", authRoutes);
app.use("/api/v1/profile", userRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/teammembers", teammemberRoutes);

// Start the server on a specific port
const port = 5000;
server.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
