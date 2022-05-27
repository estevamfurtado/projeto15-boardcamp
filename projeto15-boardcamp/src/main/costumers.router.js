import { Router } from "express";
import { getCostumerById, getCostumers, postCostumer, updateCostumerById, validateCostumerBody, validateCostumerId } from "./costumers.controllers.js";

const router = Router();

router.get('/', getCostumers);
router.get('/:id', validateCostumerId, getCostumerById);
router.post('/', validateCostumerBody, postCostumer);
router.put('/:id', validateCostumerBody, updateCostumerById);

export default router;