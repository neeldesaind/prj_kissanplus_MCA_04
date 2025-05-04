// routes/contactRoutes.js

import express from 'express';
import { submitContactForm, getContactDetails } from '../controllers/contactusController.js'; // Adjust the import path as necessary

const router = express.Router();

// POST request to /api/contact
router.post('/', submitContactForm);
router.get('/fetchcontact', getContactDetails);

export default router;
