import { Router } from "express";
import { getCostumerById, getCostumers, postCostumer, updateCostumer, validateCostumerBody } from "./costumers.controllers.js";

const router = Router();

router.get('/', getCostumers);
router.get('/:id', getCostumerById);
router.post('/', validateCostumerBody, postCostumer);
router.put('/:id', validateCostumerBody, updateCostumer);

export default router;