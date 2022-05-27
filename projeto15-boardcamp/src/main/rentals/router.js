import { Router } from "express";
import { validateRentalBody, validateRentalId, validateRentalIsNotReturned } from "./middlewares.js";
import { deleteRentalById, getRentalsMetrics, getRentals, postRental, returnRentalById } from "./controllers.js";

const router = Router();

router.get('/', getRentals);
router.post('/', validateRentalBody, postRental);
router.post('/:id/return', validateRentalId, validateRentalIsNotReturned, returnRentalById);
router.delete('/:id', validateRentalId, validateRentalIsNotReturned, deleteRentalById);
router.get('/rentals/metrics', getRentalsMetrics);

export default router;