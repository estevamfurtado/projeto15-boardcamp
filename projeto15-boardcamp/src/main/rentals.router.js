import { Router } from "express";
import { deleteRentalById, getRentalsMetrics, getRentals, postRental, returnRentalById, validateRentalBody } from "./rentals.controllers.js";

const router = Router();

router.get('/', getRentals);
router.post('/', validateRentalBody, postRental);
router.post('/:id/return', returnRentalById);
router.delete('/:id', deleteRentalById);
router.get('/rentals/metrics', getRentalsMetrics);

export default router;