import express from 'express';
import { createOrder, verifyPayment, savePayment,getAllPayments } from '../controllers/razorpayController.js';  // Import controller methods

const router = express.Router();

// Route to create a Razorpay order
router.post('/create-order', createOrder);

// Route to verify Razorpay payment
router.post('/verify-payment', verifyPayment);
router.post('/save-payment', savePayment);
router.get('/payments', getAllPayments);

export default router;
