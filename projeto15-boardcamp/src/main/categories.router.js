import { Router } from "express";
import { getCategories, postCategory, validateCategoryBody } from "./categories.controllers.js";

const router = Router();

router.get('/', getCategories);
router.post('/', validateCategoryBody, postCategory);

export default router;