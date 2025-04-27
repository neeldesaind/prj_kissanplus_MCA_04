import express from 'express';
import { getForm12Data, saveForm12Data, updateDateOfSupply, getForm12,approveForm12,denyForm12, getForm12ById, getUserRates, getTotalRatesByUserId } from '../controllers/form12Controller.js';

const router = express.Router();

router.get('/getform12data', getForm12Data);
router.post('/save', saveForm12Data);
router.put('/update/:id', updateDateOfSupply);
router.get('/all', getForm12); // Get all Form12 applications
router.put('/approve/:id', approveForm12);
router.put('/deny/:id', denyForm12);
router.get('/:id', getForm12ById);
router.get('/user-rates/:userId', getUserRates);
router.get('/total-rates/:userId', getTotalRatesByUserId);

export default router;
