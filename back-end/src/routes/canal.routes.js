import express from 'express';
import { addCanal, getCanalsByVillage, updateCanal } from '../controllers/canalController.js';  // Import the addCanal controller

const router = express.Router();

// Route to add a new canal
router.post('/add', addCanal);
router.get('/village/:villageId', getCanalsByVillage);
router.put('/:canal_id', updateCanal);

export default router;
