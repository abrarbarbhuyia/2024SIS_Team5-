const { MongoClient, Binary } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const uri = process.env.DATABASE_URI;
console.log(uri);
const client = new MongoClient(uri);

const fs = require("fs");

async function insertDoc(collType, docs) {
  const db = client.db("SIS0");
  const coll = db.collection(collType);
  return await coll.insertMany(docs);
}

async function testConnection() {
  try{
    await client.connect();
    console.log("Connection to database successful");
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

module.exports = {
  dbOp: async function (operationType, collType, entry) {
    await client.connect();
    let result;
    try {
      const { docs } = entry;
      switch (operationType) {
        case 'insert':
          result = await insertDoc(collType, docs);
          console.log('Insert Doc Result:', result);
          break;
        default:
          console.log("Invalid operation type.");
      }
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setTimeout(async ()  => await client.close(), 6000)
    }
  }, 
  testConnection
};