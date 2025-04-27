import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import { useNavigate,useLocation } from "react-router";
import { toast,Toaster } from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;


function SignIn() {
  const emailInputRef = useRef(null);
  const navigate = useNavigate(); // Initialize navigate hook
  const location = useLocation(); // <-- Added for URL query param detection

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verificationStatus = params.get("verified");

    // Prevent duplicate toasts using sessionStorage
    if (verificationStatus && !sessionStorage.getItem("toastShown")) {
        sessionStorage.setItem("toastShown", "true");

        if (verificationStatus === "success") {
            toast.success("Email verified successfully! Please login.");
        } else if (verificationStatus === "failed") {
            toast.error("Email verification failed. Please try again.");
        } else if (verificationStatus === "true") {
            toast("Email is already verified. Please login.", {
                duration: 3000
            });
        }
    }
}, [location]);

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const validateForm = () => {
    let formErrors = {};
    if (!email) formErrors.email = "Email is required";
    if (!password) formErrors.password = "Password is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss(); 

    if (validateForm()) {
        try {
            const response = await axios.post(`${BASE_URL}/api/users/login`, { 
                email: email.trim().toLowerCase(), 
                password 
            });

            const { accessToken, role, firstName, lastName } = response.data;

            localStorage.setItem("authToken", accessToken);
            localStorage.setItem("userRole", role?.toLowerCase());
            localStorage.setItem("firstName", firstName);
            localStorage.setItem("lastName", lastName);
            localStorage.setItem("userId", response.data._id);  // ✅ Ensure `userId` is set

            toast.success(`Welcome, ${firstName} ${lastName}!`, { duration: 3000 });
            navigate("/side-bar/dashboard");
        } catch (error) {
            console.error("Login Error:", error.response?.data);
            toast.error(error.response?.data?.message || "Login failed", { duration: 3000 });
        }
    } else {
        toast.error("Please fix the highlighted errors.", { duration: 3000 });
    }
};

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
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
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
                <p className="mt-2 text-base text-gray-600">
                  Don’t have an account? <a href="/sign-up" className="text-green-600 hover:underline">Create a account</a>
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
                        placeholder="Enter your email address"
                        className="block w-full p-2 text-black placeholder-gray-500 border border-gray-200 rounded-md focus:outline-none focus:border-green-600"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-base font-medium text-gray-900">Password</label>
                      <a href="forgot-password" className="text-sm text-rose-500 hover:underline">Forgot password?</a>
                    </div>
                    <div className="mt-2.5 relative">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        className="block w-full p-2 text-black placeholder-gray-500 border border-gray-200 rounded-md focus:outline-none focus:border-green-600"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                      </span>
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full px-3 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 flex items-center justify-center cursor-pointer"
                    >
                      Log in
                      <FaArrowRight className="ml-2" />
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

export default SignIn;
