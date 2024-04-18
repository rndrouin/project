// Importing required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const da = require("./data-access"); // Importing data-access.js
require("dotenv").config();

// Creating express app object
const app = express();

// Setting the port
const port = 4000;

// Use the bodyParser middleware
app.use(bodyParser.json());

// Implementing a static file server
app.use(express.static(path.join(__dirname, 'public')));

// Middleware function to check API key
function checkAPIKey(req, res, next) {
  const apiKey = process.env.API_KEY;
  const requestAPIKey = req.headers['x-api-key'];

  //attempted to troubleshoot
  //console.log("apiKey:", apiKey);
  //console.log("requestAPIKey:", requestAPIKey);

  if (!requestAPIKey) {
    res.status(401).send('API Key is missing');
  } else if (requestAPIKey !== apiKey) {
    res.status(403).send('API Key is invalid');
  } else {
    next();
  }
}

// Adding an app.get() statement to retrieve customers from MongoDB
app.get("/customers", checkAPIKey, async (req, res) => {
  const [cust, err] = await da.getCustomers(); // Calling the getCustomers() method from data-access.js

  if (cust !== null) {
    res.send(cust);
  } else {
    res.status(500).send(err);
  }
});

// Adding a GET handler for the "reset" path
app.get("/reset", checkAPIKey, async (req, res) => {
  const [result, err] = await da.resetCustomers(); // Calling the resetCustomers() method from data-access.js

  if (result !== null) {
    res.send(result);
  } else {
    res.status(500).send(err);
  }
});

// Adding a POST handler for the "customers" path
app.post("/customers", checkAPIKey, async (req, res) => {
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

// Adding a GET handler for the "customers/:id" path
app.get("/customers/:id", checkAPIKey, async (req, res) => {
  const id = req.params.id;
  const [cust, err] = await da.getCustomerById(id);
  if (cust) {
    res.send(cust);
  } else {
    res.status(404).send(err);
  }
});

// Adding a PUT handler for the "customers/:id" path
app.put("/customers/:id", checkAPIKey, async (req, res) => {
  const updatedCustomer = req.body;
  const id = req.params.id;

  if (!updatedCustomer) {
    res.status(400).send("Missing request body");
    return;
  }

  delete updatedCustomer._id;

  const [message, errMessage] = await da.updateCustomer(updatedCustomer);

  if (message) {
    res.send(message);
  } else {
    res.status(400).send(errMessage);
  }
});

// Adding a DELETE handler for the "customers/:id" path
app.delete("/customers/:id", checkAPIKey, async (req, res) => {
  const id = req.params.id;
  const [message, errMessage] = await da.deleteCustomerById(id);

  if (message) {
    res.send(message);
  } else {
    res.status(404).send(errMessage);
  }
});

// Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});