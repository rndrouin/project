// Importing required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const da = require("./data-access"); // Importing data-access.js

// Creating express app object
const app = express();

// Setting the port
const port = 4000;

// Use the bodyParser middleware
app.use(bodyParser.json());

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

// Adding a GET handler for the "reset" path
app.get("/reset", async (req, res) => {
  const [result, err] = await da.resetCustomers(); // Calling the resetCustomers() method from data-access.js

  if (result !== null) {
    res.send(result);
  } else {
    res.status(500).send(err);
  }
});

// Adding a POST handler for the "customers" path
app.post("/customers", async (req, res) => {
  const newCustomer = req.body;
  
  if (!newCustomer) {
    res.status(400).send("Missing request body");
    return;
  }
  
  const [status, id, errMessage] = await da.addCustomer(newCustomer);
  
  if (status === "success") {
    newCustomer._id = id;
    res.status(201).json(newCustomer);
  } else {
    res.status(400).send(errMessage);
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});