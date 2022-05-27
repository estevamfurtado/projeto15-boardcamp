import { Router } from "express";
import { validateCategoryBody } from "./middlewares.js";
import { getCategories, postCategory } from "./controllers.js";

const router = Router();

router.get('/', getCategories);
router.post('/', validateCategoryBody, postCategory);

export default router;