import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { toast,Toaster } from "react-hot-toast";

import { useNavigate } from "react-router";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function SignUp() {
  const firstNameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
    firstNameRef.current.focus();
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    termsAccepted: false,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState({});

  const passwordRules = {
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const validateForm = () => {
    toast.dismiss(); // Dismiss all toasts before showing new ones
    let errors = {};

    const trimmedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
    };

    if (!trimmedData.firstName) errors.firstName = "First Name is required";
    if (!trimmedData.lastName) errors.lastName = "Last Name is required";
    if (!trimmedData.email) errors.email = "Email is required";

    if (!trimmedData.password) {
      errors.password = "Password is required";
    } else if (!Object.values(passwordRules).every(Boolean)) {
      errors.password =
        "Password must have at least one uppercase, one lowercase, one number, and one special character.";
    }

    if (!formData.termsAccepted) {
      errors.termsAccepted = "You must accept the terms";
    }

    setShowErrors(errors);

    // Show all errors at once in a single toast
    if (Object.keys(errors).length) {
      toast.error("Please fix the highlighted errors.", {
        duration: 3000,
      });
    }

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowErrors({}); 

    if (!validateForm()) return;

    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/users/register`, formData);

      toast.success("Verification Link Sent Successfully!", {
        duration: 3000,
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        termsAccepted: false,
      });
      setShowErrors({});
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong!", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative py-10 sm:py-16 lg:py-10">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="absolute inset-0">
        <img
          className="object-cover w-full h-full blur-sm"
          src="Common-Background/Common-Background.jpg"
          alt="Background"
        />
      </div>

      <div className="relative flex justify-center items-center h-full">
        <div className="relative z-10 w-full max-w-lg bg-white p-0 rounded-lg shadow-lg">
          <div className="px-4 py-6 sm:px-8 sm:py-7">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Create an Account
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="space-y-5">
                <div className="flex space-x-5">
                  <div className="w-1/2">
                    <label className="text-base font-medium text-gray-900">
                      First Name
                    </label>
                    <input
                      ref={firstNameRef}
                      type="text"
                      placeholder="eg. John"
                      className="block w-full p-2 border rounded-md focus:outline-none"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                    {showErrors.firstName && (
                      <p className="text-red-500 text-sm">
                        {showErrors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="w-1/2">
                    <label className="text-base font-medium text-gray-900">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="eg. Doe"
                      className="block w-full p-2 border rounded-md focus:outline-none"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                    {showErrors.lastName && (
                      <p className="text-red-500 text-sm">
                        {showErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="eg. johndoe@domain.com"
                    className="block w-full p-2 border rounded-md focus:outline-none"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {showErrors.email && (
                    <p className="text-red-500 text-sm">{showErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-base font-medium text-gray-900">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="Enter password"
                      className="block w-full p-2 border rounded-md focus:outline-none"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                    <span
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {showErrors.password && (
                    <p className="text-red-500 text-sm">
                      {showErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          termsAccepted: e.target.checked,
                        })
                      }
                    />
                    <span className="ml-2">
                      I accept the terms and conditions
                    </span>
                  </label>
                  {showErrors.termsAccepted && (
                    <p className="text-red-500 text-sm">
                      {showErrors.termsAccepted}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className={`w-full px-4 py-4 text-white bg-green-600 hover:bg-green-700 rounded-md flex items-center justify-center ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}{" "}
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <span
                      className="text-green-600 hover:underline cursor-pointer"
                      onClick={() => navigate("/login-page")}
                    >
                      Login
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
