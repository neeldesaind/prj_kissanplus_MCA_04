export const accountCreationEmailTemplate = (firstName, email, password, loginLink) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; 
                border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://lh3.googleusercontent.com/a/ACg8ocISTyKQ5pLt5y-PF1oTgsISBgIgUxQSC42lJ-JSOwj2wtCu9EaX4l0dnlraTkhwfliMThr7jcWGoLcytOZCswnpFL9KHVg=s324-c-no" 
                 alt="Kissan Plus Logo" 
                 style="max-width: 150px; height: auto;">
        </div>

        <h2 style="color: #4CAF50;">Hello, ${firstName}!</h2>
        <p style="font-size: 16px; color: #333;">
            Your account has been successfully created on <strong>Kissan Plus</strong>. Below are your login credentials:
        </p>
        <p style="font-size: 16px; color: #333;">
            📧 <strong>Email:</strong> ${email} <br>
            🔑 <strong>Password:</strong> ${password}
        </p>
        <div style="text-align: center; margin: 20px 0;">
            <a href="${loginLink}" 
               style="background-color: #4CAF50; color: #fff; padding: 10px 20px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
               Login Now
            </a>
        </div>
        <p style="font-size: 14px; color: #666;">
            For security reasons, we recommend changing your password after logging in.
        </p>
        <p style="font-size: 12px; color: #999;">
            If you did not sign up for this account, please ignore this email.
        </p>
    </div>
`;
