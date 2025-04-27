export const paymentConfirmationEmailTemplate = (firstName, amount, cropName, transactionId, paymentDate) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;
              border: 1px solid #e0e0e0; border-radius: 10px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://lh3.googleusercontent.com/a/ACg8ocISTyKQ5pLt5y-PF1oTgsISBgIgUxQSC42lJ-JSOwj2wtCu9EaX4l0dnlraTkhwfliMThr7jcWGoLcytOZCswnpFL9KHVg=s324-c-no" 
           alt="Kissan Plus Logo" 
           style="max-width: 150px; height: auto;">
    </div>

    <h2 style="color: #4CAF50;">Hello, ${firstName}!</h2>
    <p style="font-size: 16px; color: #333;">
      We’ve received your payment successfully. Thank you for making the payment towards your irrigation charges for <strong>${cropName}</strong>.
    </p>

    <p style="font-size: 16px; color: #333; margin-top: 10px;">
      💳 <strong>Amount Paid:</strong> ₹${amount} <br>
      🆔 <strong>Transaction ID:</strong> ${transactionId} <br>
      📅 <strong>Payment Date:</strong> ${paymentDate}
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <span style="background-color: #e8f5e9; color: #2e7d32; padding: 10px 20px; 
                   border-radius: 5px; display: inline-block; font-weight: bold;">
        Payment Confirmed
      </span>
    </div>

    <p style="font-size: 14px; color: #666;">
      If you have any questions or concerns, feel free to contact our support team at 
      <a href="mailto:support@kissanplus.in" style="color: #4CAF50;">support@kissanplus.in</a>.
    </p>

    <p style="font-size: 12px; color: #999;">
      This is an automated message. Please do not reply to this email.
    </p>
  </div>
`;
