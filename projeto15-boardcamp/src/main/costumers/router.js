import { Router } from "express";
import { validateCostumerBody, validateCostumerCPF, validateCostumerId } from "./middlewares.js";
import { getCostumerById, getCostumers, postCostumer, updateCostumerById } from "./controllers.js";

const router = Router();

router.get('/', getCostumers);
router.get('/:id', validateCostumerId, getCostumerById);
router.post('/', validateCostumerBody, validateCostumerCPF, postCostumer);
router.put('/:id', validateCostumerBody, validateCostumerId, updateCostumerById);

export default router;