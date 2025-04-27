import express from 'express';
import { submitExemption, getExemptionsByUserId, getAllExemptions, getExemptionById,approveExemption,denyExemption } from '../controllers/exemptionController.js'; // Adjust path accordingly

const router = express.Router();

// Route for submitting exemption application
router.post('/submit-exemption', submitExemption);
router.get("/user/:userId", getExemptionsByUserId);
router.get('/all', getAllExemptions);
router.get("/:exemption_id", getExemptionById);
router.put("/:id/approve", approveExemption);
router.put("/:id/deny", denyExemption);


export default router;
