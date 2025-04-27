import { useState, useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa"; // Importing the back arrow icon
import { useNavigate } from "react-router"; // Importing useNavigate for navigation

function OTPPage() {
  const navigate = useNavigate(); // Initialize useNavigate hook for routing

  const [otp, setOtp] = useState(""); // OTP state to store entered digits
  const [error, setError] = useState("");

  const otpInputRef = useRef(null); // Create a reference to the input field

  useEffect(() => {
    // Auto-focus the input field when the component mounts
    otpInputRef.current.focus();
  }, []);

  // Handle change for OTP input field
  const handleChange = (e) => {
    const value = e.target.value;

    // Allow only digits and ensure OTP doesn't exceed 6 digits
    if (/^[0-9]{0,6}$/.test(value)) {
      setOtp(value); // Update OTP state with the entered digits
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate OTP length
    if (otp.length !== 6) {
      setError("OTP must be 6 digits long");
    } else {
      setError(""); // Clear error if OTP is correct
      console.log("OTP submitted:", otp);
      // Perform OTP verification here

      // Navigate to the update-password route after OTP is verified
      navigate("/update-password");
    }
  };

  return (
    <div>
      <section className="relative py-10 bg-gray-900 sm:py-16 lg:py-24">
        <div className="absolute inset-0">
          <img className="object-cover w-full h-full blur-sm" src="Common-Background/Common-Background.jpg" alt="" />
        </div>
        <div className="absolute inset-0 bg-gray-900/30"></div>
        <div className="relative max-w-lg px-4 mx-auto sm:px-0">
          <div className="overflow-hidden bg-white rounded-md shadow-md">
            <div className="px-4 py-6 sm:px-8 sm:py-7">
              {/* Back Arrow Icon */}
              <div className="absolute top-6 left-4 cursor-pointer text-black" onClick={() => window.history.back()}>
                <FaArrowLeft size={24} />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Enter OTP</h2>
                <p className="mt-2 text-base text-gray-600">
                  Enter the OTP sent to your email to reset your password.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="mt-8">
                <div className="space-y-5">
                  <div>
                    <label className="text-base font-medium text-gray-900">OTP</label>
                    <div className="mt-2.5">
                      <input
                        ref={otpInputRef} // Set the input field reference for auto-focus
                        type="text"
                        placeholder="Enter OTP"
                        className="block w-full p-2 text-black placeholder-gray-500 border border-gray-200 rounded-md focus:outline-none focus:border-green-600"
                        value={otp}
                        onChange={handleChange}
                        maxLength="6" // Allow only 6 digits
                        inputMode="numeric" // Display numeric keyboard on mobile
                      />
                      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full px-4 py-4 text-white bg-green-600 rounded-md hover:bg-green-700 cursor-pointer"
                    >
                      Verify OTP
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OTPPage;
