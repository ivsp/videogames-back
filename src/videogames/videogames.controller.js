import {
  getGameInfoByFile,
  getAllGames,
  createNewGameByBody,
  getGameByPlatTitleDevAndPubl,
} from "./videogames.model.js";
import { Public } from "../middleware/file-save.middleware.js";
import { sedCreatedNewGameEmail } from "../adapters/email.js";

export const getGameInfoByFileController = async (req, res) => {
  const videogames = await getGameInfoByFile();
  // console.log("controller", videogames);
  if (videogames !== null) {
    res.status(200).json(videogames);
  } else {
    res
      .status(404)
      .json({ err: "The server couldn't find the requested content." });
  }
};

export const getAllGamesController = async (req, res) => {
  const videogames = await getAllGames();
  if (videogames !== null) {
    res.status(200).json(videogames);
  } else {
    res
      .status(404)
      .json({ err: "The server couldn't find the requested content." });
  }
};

export const addNewGameController = async (req, res) => {
  const { email } = req.query;

  const img = `${Public}${req.file?.filename}`;

  const {
    platform,
    title,
    developer,
    publisher,
    firstRelease,
    secondRelease,
    thirdRelease,
    fourthRelease,
    japanRelease,
    northAmericaRelease,
    europeRelease,
    australiaRelease,
  } = req.body;

  const body = {
    ...req.body,
    file: img ? img : "static/undefined",
    firstRelease: firstRelease ? parseInt(firstRelease) : "-",
    othersReleases: [
      secondRelease ? parseInt(secondRelease) : "-",
      thirdRelease ? parseInt(thirdRelease) : "-",
      fourthRelease ? parseInt(fourthRelease) : "-",
    ],
    japanRelease: japanRelease ? parseInt(japanRelease) : "-",
    northAmericaRelease: northAmericaRelease
      ? parseInt(northAmericaRelease)
      : "-",
    europeRelease: europeRelease ? parseInt(europeRelease) : "-",
    australiaRelease: australiaRelease ? parseInt(australiaRelease) : "-",
  };
  const games = await getGameByPlatTitleDevAndPubl(
    platform,
    title,
    developer,
    publisher
  );
  if (games === null) {
    await createNewGameByBody(body);

    //mando el correo para saber que se ha creado correctamente
    sedCreatedNewGameEmail(email);
    res.status(201).json(body);
  } else {
    res.status(409).json({ err: "The game already exists." });
  }
};

export const getGameDetailsController = async (req, res) => {
  const { platform, title, developer, publisher } = req.query;
  const game = await getGameByPlatTitleDevAndPubl(
    platform,
    title,
    developer,
    publisher
  );
  if (game !== null) {
    res.status(201).json(game);
  } else {
    res
      .status(409)
      .json({ err: "The server couldn't find the requested content." });
  }
};
