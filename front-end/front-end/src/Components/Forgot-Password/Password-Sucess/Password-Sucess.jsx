import { useState, useEffect } from "react";
import Lottie from "react-lottie";
import { useNavigate } from "react-router"; // To navigate after success

const PasswordSuccess = () => {
  const navigate = useNavigate(); // To navigate after password change
  const [animationData, setAnimationData] = useState(null); // Store animation data

  // Lottie configuration for success animation
  const defaultOptions = {
    loop: true,
    autoplay: true, // Animation will play only once
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  // Function to load the animation JSON
  const loadAnimation = () => {
    fetch("/Animations/success.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => {
        console.error("Error loading animation data:", error);
      });
  };

  useEffect(() => {
    loadAnimation(); // Call the function when the component mounts
  }, []); // Empty array means it runs only once when the component mounts

  const handleNavigate = () => {
    navigate("/login-page"); // Navigate to the login page
  };

  return (
    <div className="relative h-[80vh] flex items-center justify-center"> {/* Set a specific height like 80vh */}
      {/* Background image with blur effect */}
      <div className="absolute inset-0 h-full">
        <img
          className="object-cover w-full h-full blur-sm"
          src="Common-Background/Common-Background.jpg"
          alt="Background"
        />
      </div>

      {/* Overlay container */}
      <div className="relative text-center bg-white rounded-lg shadow-lg p-10 z-10">
        {/* Lottie animation at the top */}
        <div className="mt-6">
          {animationData ? (
            <Lottie options={defaultOptions} height={100} width={100} /> // Reduced size
          ) : (
            <p>Loading animation...</p>
          )}
        </div>

        <h2 className="text-2xl font-bold text-green-600">Password Changed Successfully!</h2>
        <p className="mt-4 text-gray-700">
          Your password has been successfully updated. You can now log in with your new credentials.
        </p>
        <button
          onClick={handleNavigate}
          className="mt-6 px-6 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 cursor-pointer"
        >
          Go to Login Page
        </button>
      </div>
    </div>
  );
};

export default PasswordSuccess;
