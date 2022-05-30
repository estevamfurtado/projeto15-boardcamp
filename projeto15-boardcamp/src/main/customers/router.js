import { Router } from "express";
import { validatecustomerBody, validatecustomerCPF, validatecustomerId } from "./middlewares.js";
import { getcustomerById, getcustomers, postcustomer, updatecustomerById } from "./controllers.js";

const router = Router();

router.get('/', getcustomers);
router.get('/:id', validatecustomerId, getcustomerById);
router.post('/', validatecustomerBody, validatecustomerCPF, postcustomer);
router.put('/:id', validatecustomerBody, validatecustomerId, updatecustomerById);

export default router;