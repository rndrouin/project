// Import the MongoDB client
const MongoClient = require('mongodb').MongoClient;

// Database name
const dbName = 'custdb';

// Base URL for MongoDB connection
const baseUrl = "mongodb://127.0.0.1:27017";

// Collection name
const collectionName = "customers"

// Connection string
const connectString = baseUrl + "/" + dbName; 

// Collection variable
let collection;

// Function to initialize the database connection
async function dbStartup() {
    const client = new MongoClient(connectString);
    await client.connect();
    collection = client.db(dbName).collection(collectionName);
}

// Function to retrieve all customers from the database
async function getCustomers() {
    try {
        const customers = await collection.find().toArray();
        return [customers, null]; // Return array [customers, errMessage]
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

// Function to retrieve a customer by ID from the database
async function getCustomerById(id) {
    try {
        const customer = await collection.findOne({"id": +id});
        if(!customer){
          return [ null, "invalid customer number"]; // Return array [customer, errMessage]
        }
        return [customer, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

// Function to add a new customer to the database
async function addCustomer(newCustomer) {
    try {
        const insertResult = await collection.insertOne(newCustomer);
        return ["success", insertResult.insertedId, null]; // Return array [status, id, errMessage]
    } catch (err) {
        console.log(err.message);
        return ["fail", null, err.message];
    }
}

// Function to reset the customers in the database
async function resetCustomers() {
    let data = [{ "id": 0, "name": "Mary Jackson", "email": "maryj@abc.com", "password": "maryj" },
    { "id": 1, "name": "Karen Addams", "email": "karena@abc.com", "password": "karena" },
    { "id": 2, "name": "Scott Ramsey", "email": "scottr@abc.com", "password": "scottr" }];

    try {
        await collection.deleteMany({});
        await collection.insertMany(data);
        const customers = await collection.find().toArray();
        const message = "data was refreshed. There are now " + customers.length + " customer records!"
        return [message, null]; // Return array [message, errMessage]
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

// Function to update a customer in the database
async function updateCustomer(updatedCustomer) {
    try {
        const filter = { "id": updatedCustomer.id };
        const setData = { $set: updatedCustomer };
        const updateResult = await collection.updateOne(filter, setData);
        return ["one record updated", null]; // Return array [message, errMessage]
    } catch (err) {
        console.log(err.message);
        return [ null, err.message];
    }
}

// Function to delete a customer by ID from the database
async function deleteCustomerById(id) {
    try {
        const deleteResult = await collection.deleteOne({ "id": +id });
        if (deleteResult.deletedCount === 0) {
            return [null, "no record deleted"]; // Return array [message, errMessage]
        } else if (deleteResult.deletedCount === 1) {
            return ["one record deleted", null]; // Return array [message, errMessage]
        } else {
            return [null, "error deleting records"] // Return array [message, errMessage]
        }
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

// Initialize the database connection
dbStartup();

// Export the functions for external use
module.exports = { 
  getCustomers, 
  resetCustomers, 
  addCustomer, 
  getCustomerById, 
  updateCustomer, 
  deleteCustomerById 
};