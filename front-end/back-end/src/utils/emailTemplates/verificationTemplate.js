export const verificationEmailTemplate = (firstName,lastName, verificationLink) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; 
                border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://lh3.googleusercontent.com/a/ACg8ocISTyKQ5pLt5y-PF1oTgsISBgIgUxQSC42lJ-JSOwj2wtCu9EaX4l0dnlraTkhwfliMThr7jcWGoLcytOZCswnpFL9KHVg=s324-c-no" 
                 alt="Kissan Plus Logo" 
                 style="max-width: 150px; height: auto;">
        </div>

        <h2 style="color: #4CAF50;">Welcome, ${firstName} ${lastName} to Kissan Plus!</h2>
        <p style="font-size: 16px; color: #333;">
            Thank you for signing up. Please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${verificationLink}" 
               style="background-color: #4CAF50; color: #fff; padding: 10px 20px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
               Verify Email
            </a>
        </div>
        <p style="font-size: 14px; color: #666;">
            If the button doesn't work, you can also click the following link: 
            <a href="${verificationLink}" style="color: #4CAF50;">${verificationLink}</a>
        </p>
        <p style="font-size: 12px; color: #999;">
            If you did not create this account, please ignore this email.
        </p>
    </div>
`;
