const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for your frontend
app.use(cors());
app.use(express.json());

// A sample route
app.get('/api/tasks', (req, res) => {
  res.json([
    { id: 1, title: 'Task 1', completed: false },
    { id: 2, title: 'Task 2', completed: true }
  ]);
});

const port = 5000;
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
