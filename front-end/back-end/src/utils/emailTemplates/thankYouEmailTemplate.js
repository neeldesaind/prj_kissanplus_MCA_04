export const thankYouEmailTemplate = (name, message) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; 
                border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://lh3.googleusercontent.com/a/ACg8ocISTyKQ5pLt5y-PF1oTgsISBgIgUxQSC42lJ-JSOwj2wtCu9EaX4l0dnlraTkhwfliMThr7jcWGoLcytOZCswnpFL9KHVg=s324-c-no" 
                 alt="Kissan Plus Logo" 
                 style="max-width: 150px; height: auto;">
        </div>

        <h2 style="color: #4CAF50;">Thank you for contacting us, ${name}!</h2>
        <p style="font-size: 16px; color: #333;">
            We have received your message and will get back to you shortly. Below is a copy of the message you sent:
        </p>
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h4 style="color: #4CAF50;">Your Message:</h4>
            <p style="font-size: 14px; color: #333;">"${message}"</p>
        </div>
        <p style="font-size: 14px; color: #666;">
            We will contact you as soon as possible.
        </p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="http://localhost:8080/contact-us" 
               style="background-color: #4CAF50; color: #fff; padding: 10px 20px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
               Visit Our Website
            </a>
        </div>
        <p style="font-size: 14px; color: #666;">
            If you did not submit this form, please ignore this email.
        </p>
    </div>
`;
