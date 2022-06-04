import { MongoClient } from "mongodb";
import XLSX from "xlsx";
import fs from "fs";

const { DB_PW, MONGO_HOSTNAME, MONGO_DB } = process.env;

const URI = `mongodb+srv://${MONGO_HOSTNAME}:${DB_PW}@hellocluster.olzv6.mongodb.net/${MONGO_DB}`;
const client = new MongoClient(URI);
const DATABASE_NAME = "videogames";
const COLLECTION_NAME = "games";

async function insertGamesExcel(collection, g) {
  try {
    const query = {
      platform: g.Platform,
      name: g.Title,
    };

    const body = {
      file: g.file ? g.file : "static/undefined",
      platform: g.Platform ? g.Platform : "-",
      name: g.Title ? g.Title : "-",
      developer: g.Developer ? g.Developer : "-",
      publisher: g.Publisher ? g.Publisher : "-",
      firstRelease: g.First_Released ? g.First_Released : "-",
      othersReleases: [
        g.Global_Release_date ? g.Global_Release_date : "-",
        g.MVS_Release_date ? g.MVS_Release_date : "-",
        g.AES_Release_date ? g.AES_Release_date : "-",
        g.CD_Release_date ? g.CD_Release_date : "-",
      ],
      dualMode: g.Dual_Mode ? g.Dual_Mode : "-",
      cartridgeFeature: g.Cartridge_Feature ? g.Cartridge_Feature : "-",
      nintendoShop: g.Nintendo_eShop ? g.Nintendo_eShop : "-",
      genre: g.Genre ? g.Genre : "-",
      license: g.License ? g.License : "-",
      macOsVersion: g.Mac_OS_Versions ? g.Mac_OS_Versions : "-",
      japanRelease: g.Japan_Release_date ? g.Japan_Release_date : "-",
      northAmericaRelease: g.North_America_Release_date
        ? g.North_America_Release_date
        : "-",
      europeRelease: g.Europe_Release_date ? g.Europe_Release_date : "-",
      australiaRelease: g.AU_Release_date ? g.AU_Release_date : "-",
    };
    const game = await collection.findOne(query);
    console.log("gameXLS", game);
    if (game === null) {
      console.log("inserto juego XLS");

      await collection.insertOne(body);
    } else {
      const updateFile = {
        $set: body,
      };
      console.log("actualizo juego XLS");
      collection.updateOne(query, updateFile);
    }
  } catch (err) {
    console.log(err);
  }
}

async function insertGamesJSON(collection, g) {
  try {
    const query = {
      platform: g.Plataforma,
      name: g.Nombre,
    };
    const game = await collection.findOne(query);
    // console.log("gameJSON", game);
    const body = {
      file: g.file ? g.file : "static/undefined",
      platform: g.Plataforma ? g.Plataforma : "-",
      name: g.Nombre ? g.Nombre : "-",
      developer: g.Desarrollador ? g.Desarrollador : "-",
      publisher: g.Distribuidor ? g.Distribuidor : "-",
      firstRelease: g.Fecha_primera_publicacion
        ? g.Fecha_primera_publicacion
        : "-",
      othersReleases: [
        g.Fecha_de_publicacion1 ? g.Fecha_de_publicacion1 : "-",
        g.Fecha_de_publicacion2 ? g.Fecha_de_publicacion2 : "-",
        g.Fecha_de_publicacion3 ? g.Fecha_de_publicacion3 : "-",
        g.Fecha_de_publicacion4 ? g.Fecha_de_publicacion4 : "-",
        g.Fecha_de_publicacion5 ? g.Fecha_de_publicacion5 : "-",
        g.Fecha_de_publicacion6 ? g.Fecha_de_publicacion6 : "-",
        g.Fecha_de_publicacion7 ? g.Fecha_de_publicacion7 : "-",
        g.Fecha_de_publicacion8 ? g.Fecha_de_publicacion8 : "-",
      ],
      dualMode: g.Modo_Dual ? g.Modo_Dual : "-",
      cartridgeFeature: g.Modo_cartucho ? g.Modo_cartucho : "-",
      nintendoShop: g.Tienda_nintendo ? g.Tienda_nintendo : "-",
      genre: g.Genero ? g.Genero : "-",
      license: g.License ? g.License : "-",
      macOsVersion: g.Mac_OS_versions ? g.Mac_OS_versions : "-",
      japanRelease: g.Japan ? g.JApan : "-",
      northAmericaRelease: g.NorthAmerica ? g.NorthAmerica : "-",
      europeRelease: g.Europe ? g.Europe : "-",
      australiaRelease: g.AU ? g.AU : "-",
    };
    if (game === null) {
      console.log("inserto juego JSON");

      // console.log("body", body);
      await collection.insertOne(body);
    } else {
      const updateFile = {
        $set: body,
      };
      console.log("actualizo juego JSON");
      collection.updateOne(query, updateFile);
    }
  } catch (err) {
    console.log(err);
  } finally {
    //await client.close();
  }
}

export const getGameInfoByFile = async () => {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const games = db.collection(COLLECTION_NAME);
    const rawData = fs.readFileSync(
      "./src/assets/game-info/games.json",
      "utf8"
    );
    const data = JSON.parse(rawData);

    data.Data.map((g) => {
      //console.log("nombre", g.Nombre);
      //funcion asincrona
      insertGamesJSON(games, g);
    });
    const workbook = XLSX.readFile("./src/assets/game-info/games-2.xlsx");
    const workbookSheets = workbook.SheetNames;
    let dataExcel = {};
    workbookSheets.map((s) => {
      const dataSheet = XLSX.utils.sheet_to_json(workbook.Sheets[s]);
      dataExcel = {
        ...dataExcel,
        dataSheet,
      };
    });
    console.log("datos excel", dataExcel.dataSheet);
    dataExcel.dataSheet.map((g) => {
      insertGamesExcel(games, g);
    });

    const allGames = await games.find({}).toArray();
    //console.log("devuelvo datos", allGames);

    return allGames;
  } catch (err) {
    console.error(err);
  }
};

export const getAllGames = async () => {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const games = db.collection(COLLECTION_NAME);
    const options = { projection: { _id: 0 } };
    return await games.find({}, options).toArray();
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
};

export const createNewGameByBody = async (body) => {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const games = db.collection(COLLECTION_NAME);
    return await games.insertOne(body);
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
};

export const getGameByPlatTitleDevAndPubl = async (
  platform,
  title,
  developer,
  publisher
) => {
  try {
    await client.connect();
    const db = client.db(DATABASE_NAME);
    const games = db.collection(COLLECTION_NAME);
    const query = { name: title, developer, platform, publisher };
    const options = { projection: { _id: 0 } };
    return await games.findOne(query, options);
  } catch (err) {
  } finally {
    await client.close;
  }
};
