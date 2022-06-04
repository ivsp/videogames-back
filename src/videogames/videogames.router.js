import express from "express";
import { upload } from "../middleware/file-save.middleware.js";
import {
  addNewGameController,
  getGameDetailsController,
  getGameInfoByFileController,
  getAllGamesController,
} from "./videogames.controller.js";

const router = express.Router();

router
  .route("/games")
  .get(getGameInfoByFileController)
  .post(upload.single("file"), addNewGameController);
router.route("/details").get(getGameDetailsController);

export default router;
