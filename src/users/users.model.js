import { MongoClient } from "mongodb";

const { DB_PW, MONGO_HOSTNAME, MONGO_DB } = process.env;

const URI = `mongodb+srv://${MONGO_HOSTNAME}:${DB_PW}@hellocluster.olzv6.mongodb.net/${MONGO_DB}`;
const client = new MongoClient(URI);
const DATABASE_NAME = "videogames";
const COLLECTION_NAME = "users";

export const createUser = async (user) => {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const users = db.collection(COLLECTION_NAME);
    return await users.insertOne(user);
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
};

// devuelve el usuario sin tener en cuenta el status o null si no existe
export const getUserByEmailNoStatus = async (email) => {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const users = db.collection(COLLECTION_NAME);
    return await users.findOne({ email });
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
};

// actualiza el usuario cambiando su estaso a success
export const validateUser = async (email) => {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const users = db.collection(COLLECTION_NAME);
    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        status: "SUCCESS",
      },
    };
    return await users.updateOne({ email }, updateDoc);
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
};

// devuelve el usuario de BBDDD que esté en estado succes y además coincida
// con el email y con password que me mandan.
export const getSuccessUserByEmailAndPassword = async (email, password) => {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const users = db.collection(COLLECTION_NAME);
    const query = {
      email,
      password,
      status: "SUCCESS",
    };
    return await users.findOne(query);
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
};
