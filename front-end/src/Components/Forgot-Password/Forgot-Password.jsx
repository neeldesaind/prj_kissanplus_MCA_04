import { useState, useEffect, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";



function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    
    const navigate = useNavigate();
    const emailInputRef = useRef(null);

    useEffect(() => {
        emailInputRef.current.focus(); // Auto-focus on email input
    }, []);

    // Email Existence Check
    const checkEmailExists = async () => {
      if (!email) {
          toast.error("Email is required.");
          return false;
      }
      
  
      try {
          const response = await axios.post(`${BASE_URL}/api/users/check-email`, { email });
          if (!response.data.exists) {
              toast.error(" Email not found in database.");
              return false;
          }
          return true; // Continue if email exists
      } catch (error) {
          if (error.response?.status === 404) {
              toast.error(" Email not found in database.");
          } else {
              toast.error(" Failed to connect to the server. Please try again.");
          }
          return false;
      }
  };
  

    // Form Validation
    const validateForm = () => {
        toast.dismiss();
        const formErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            formErrors.email = "Email is required.";
        } else if (!emailRegex.test(email)) {
            formErrors.email = "Please enter a valid email address.";
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const emailExists = await checkEmailExists();
            if (!emailExists) return;

            setLoading(true);
            try {
                await axios.post(`${BASE_URL}/api/users/forgot-password`, { email });
                toast.success("📩 Password reset link sent successfully.");
                navigate("/login-page");
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Failed to send reset link.";
                toast.error(`${errorMessage}`);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <section className="relative py-10 bg-gray-900 sm:py-16 lg:py-24">
                <div className="absolute inset-0">
                    <img className="object-cover w-full h-full blur-sm" src="Common-Background/Common-Background.jpg" alt="" />
                </div>
                <div className="absolute inset-0 bg-gray-900/30"></div>
                <div className="relative max-w-lg px-4 mx-auto sm:px-0">
                    <div className="overflow-hidden bg-white rounded-md shadow-md">
                        <div className="px-4 py-6 sm:px-8 sm:py-7">
                            <div className="absolute top-6 left-4 cursor-pointer text-black" onClick={() => window.history.back()}>
                                <FaArrowLeft size={24} />
                            </div>
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
                                <p className="mt-2 text-base text-gray-600">
                                    Enter your email address and we will send you a reset link to reset your password.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="mt-8">
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-base font-medium text-gray-900">Email address</label>
                                        <div className="mt-2.5">
                                            <input
                                                ref={emailInputRef}
                                                type="email"
                                                placeholder="Enter your email"
                                                className="block w-full p-2 text-black placeholder-gray-500 border border-gray-200 rounded-md focus:outline-none focus:border-green-600"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className={`w-full ${loading ? "bg-green-400" : "bg-green-600"} text-white py-2 rounded-md hover:bg-green-700`}
                                            disabled={loading}
                                        >
                                            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;