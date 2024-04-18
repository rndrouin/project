// Importing required modules
const express = require('express');
const path = require('path');
const da = require("./data-access"); // Importing data-access.js

// Creating express app object
const app = express();

// Setting the port
const port = 4000;

// Implementing a static file server
app.use(express.static(path.join(__dirname, 'public')));

// Adding an app.get() statement to retrieve customers from MongoDB
app.get("/customers", async (req, res) => {
  const [cust, err] = await da.getCustomers(); // Calling the getCustomers() method from data-access.js

  if (cust !== null) {
    res.send(cust);
  } else {
    res.status(500).send(err);
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});