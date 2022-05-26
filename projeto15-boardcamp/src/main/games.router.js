import { Router } from "express";
import { getGames, postGame, validateGameBody } from "./games.controllers.js";

const router = Router();

router.get('/', getGames);
router.post('/', validateGameBody, postGame);

export default router;