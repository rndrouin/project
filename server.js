// Importing required modules
const express = require('express');
const path = require('path');

// Creating express app object
const app = express();

// Setting the port
const port = 4000;

// Implementing a static file server
app.use(express.static(path.join(__dirname, 'public')));

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});