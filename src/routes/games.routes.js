import { Router } from "express";
import { insertGames, listGames } from "../controllers/games.controller.js";

const gamesRouter = Router();

gamesRouter.post("/games", insertGames);
gamesRouter.get("/games", listGames);

export default gamesRouter;
