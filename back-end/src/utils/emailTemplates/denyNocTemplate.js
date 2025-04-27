export const denyNocTemplate = (nocId) => `
  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fff5f5;
                border: 1px solid #fed7d7; border-radius: 10px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://lh3.googleusercontent.com/a/ACg8ocISTyKQ5pLt5y-PF1oTgsISBgIgUxQSC42lJ-JSOwj2wtCu9EaX4l0dnlraTkhwfliMThr7jcWGoLcytOZCswnpFL9KHVg=s324-c-no"
             alt="Kissan Plus Logo"
             style="max-width: 150px; height: auto;">
      </div>
      <h2 style="color: #e53e3e;">NOC Application Denied</h2>
      <p style="color: #333;">Your NOC application <strong>(${nocId})</strong> has been denied by Talati.</p>
      <p style="color: #666;">Please contact support for further assistance.</p>
    </div>
  </div>
`;