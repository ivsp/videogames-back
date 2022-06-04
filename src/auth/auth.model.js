import { MongoClient } from "mongodb";
const { DB_PW, MONGO_HOSTNAME, MONGO_DB } = process.env;

const URI = `mongodb+srv://${MONGO_HOSTNAME}:${DB_PW}@hellocluster.olzv6.mongodb.net/${MONGO_DB}`;
const client = new MongoClient(URI);
const DATABASE_NAME = "videogames";
const COLLECTION_NAME = "validate-token";

export const createValidationToken = async (token, userName) => {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const tokens = db.collection(COLLECTION_NAME);
    return await tokens.insertOne({
      // asociamos el token al usuario en la BBDD
      token,
      user: userName,
    });
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
};

// devuelve el token o null si no existe
export const retrieveValidationToken = async (token) => {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const tokens = db.collection(COLLECTION_NAME);
    return await tokens.findOne({ token });
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
};

// borra el token de la BBDD
export const deleteValidationToken = async (token) => {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const tokens = db.collection(COLLECTION_NAME);
    return await tokens.deleteOne({ token });
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
};
