import { Router } from "express";
import { deleteRentalById, getRentalsMetrics, getRentals, postRental, returnRentalById, validateRentalBody, validateRentalId } from "./rentals.controllers.js";

const router = Router();

router.get('/', getRentals);
router.post('/', validateRentalBody, postRental);
router.post('/:id/return', validateRentalId, returnRentalById);
router.delete('/:id', validateRentalId, deleteRentalById);
router.get('/rentals/metrics', getRentalsMetrics);

export default router;