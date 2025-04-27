import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Payment from '../models/models.payment/payment.model.js'; // Import the Payment model
import mailTransporter from "../utils/config/mailTransporter.js";
import { paymentConfirmationEmailTemplate } from "../utils/emailTemplates/paymentConfirmationEmailTemplate .js";
import Form12 from "../models/models.forms/form12.model.js"; // Import the Form12 model
import User from "../models/models.user/user.model.js"; // Import the User model


dotenv.config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Public key from Razorpay
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Secret key from Razorpay
});

// Create an order
export const createOrder = async (req, res) => {
  const { amount } = req.body;  // Amount in INR paise
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const options = {
      amount: amount * 100,  // Razorpay expects the amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,  // 1 for automatic capture
    };

    const order = await razorpay.orders.create(options);
    res.json({
      success: true,
      orderId: order.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// Verify payment
export const verifyPayment = (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing payment details' });
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
};


export const savePayment = async (req, res) => {
  const { userId, razorpay_payment_id, razorpay_order_id, razorpay_signature, status, amount, form12Id } = req.body;

  // Validate incoming data
  if (!userId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !form12Id) {
    return res.status(400).json({ message: "Missing required payment details." });
  }

  try {
    const paymentStatus = status || "pending";  // Default to 'pending' if no status is provided

    // Create a new payment entry
    const payment = new Payment({
      userId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      status: paymentStatus,  // Save the status from frontend (Success, Failed, Pending)
      amount,
      form_12_id: form12Id,  // Link to Form12
    });

    // Save payment details to the database
    const savedPayment = await payment.save();

    // After saving the payment, we update the status to 'success' in the database (if successful)
    if (status === "success") {
      savedPayment.status = "success";
      await savedPayment.save();  // Save the updated payment status to DB
    }

    // Link the payment with Form12
    const form12 = await Form12.findOne({ form_12_id: form12Id });
    if (!form12) {
      return res.status(404).json({ message: 'Form12 not found' });
    }

    // Update payment status and details in Form12
    form12.paymentStatus = savedPayment.status;
    form12.paymentDetails = {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    };

    // Save the updated Form12
    await form12.save();

    // Populate user to get email and names
    const populatedPayment = await Payment.findById(savedPayment._id).populate({
      path: "userId",
      select: "email firstName lastName",  // Ensure firstName and lastName are included
    });

    const userEmail = populatedPayment?.userId?.email;
    const userFirstName = populatedPayment?.userId?.firstName;

    // Send email asynchronously after saving the payment
    if (userEmail) {
      try {
        await mailTransporter.sendMail({
          from: process.env.GMAIL_USER,
          to: userEmail,
          subject: "Payment Confirmation",
          html: paymentConfirmationEmailTemplate(userFirstName, amount, form12.cropName, razorpay_payment_id, new Date().toLocaleDateString()),
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Log the error but don't modify payment status
        // You might want to notify the user or retry email sending later
      }
    }

    // Send a success response
    res.status(200).json({ message: "Payment saved successfully", payment: savedPayment });
  } catch (error) {
    // Log the error and send an error response
    console.error("Error saving payment:", error);
    res.status(500).json({ message: "Failed to save payment details", error: error.message });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find(); // Fetch all payment records
    const paymentsWithDetails = [];

    // Loop through each payment to enrich it with user and Form12 details
    for (const payment of payments) {
      // Fetch user details
      const user = await User.findById(payment.userId);

      // Fetch Form12 details
      const form12 = await Form12.findOne({ form_12_id: payment.form_12_id });

      // Combine payment with user and Form12 data
      paymentsWithDetails.push({
        paymentId: payment._id,
        razorpayPaymentId: payment.razorpay_payment_id,
        razorpayOrderId: payment.razorpay_order_id,
        razorpaySignature: payment.razorpay_signature,
        status: payment.status,
        amount: payment.amount,
        createdAt: payment.createdAt,
        user: {
          name: user ? `${user.firstName} ${user.lastName}` : 'Unknown', // Concatenated first and last name
          email: user ? user.email : 'Unknown', // Assuming User has 'email' field
        },
        form12Details: {
          form12Id: form12 ? form12.form_12_id : 'Unknown',
          ratePerVigha: form12 ? form12.rate_per_vigha : 'N/A',
          totalRate: form12 ? form12.total_rate : 'N/A',
          isApprovedByEngineer: form12 ? form12.isApprovedByEngineer : false,
          isDeniedByEngineer: form12 ? form12.isDeniedByEngineer : false,
        }
      });
    }

    // Send the enriched payment data as the response
    res.status(200).json(paymentsWithDetails);
  } catch (error) {
    console.error('Error fetching payments with user and Form12 details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
