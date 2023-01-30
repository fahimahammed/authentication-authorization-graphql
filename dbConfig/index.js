const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'auth-db';


// Use connect method to connect to the server
client.connect();
console.log('Connected successfully to server');
const db = client.db(dbName);
const collection = db.collection('users');



module.exports = {collection, db};