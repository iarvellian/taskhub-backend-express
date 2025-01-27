// Import the express module
const express = require('express');

// Create an instance of express
const app = express();

// Define a simple route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
