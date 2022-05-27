import { Router } from "express";
import { validateGameBody } from "./middlewares.js";
import { getGames, postGame } from "./controllers.js";

const router = Router();

router.get('/', getGames);
router.post('/', validateGameBody, postGame);

export default router;