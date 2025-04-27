import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";


function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState({});
   
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const validateForm = () => {
        const formErrors = {};
        if (!newPassword) formErrors.newPassword = "New Password is required.";
        if (!confirmPassword) formErrors.confirmPassword = "Confirm Password is required.";
        if (newPassword !== confirmPassword) formErrors.confirmPassword = "Passwords do not match.";
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await axios.post(`${BASE_URL}/api/users/reset-password/${token}`, { newPassword });
                toast.success("Password successfully reset.");
                navigate("/login-page");
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Failed to reset password.";
                toast.error(errorMessage);
            }
        }
    };

    return (
        <div>
            <Toaster position="top-center" reverseOrder={false} />
            <section className="relative py-10 bg-gray-900 sm:py-16 lg:py-24">
                <div className="absolute inset-0">
                    <img className="object-cover w-full h-full blur-sm" src="/Common-Background/Common-Background.jpg" alt="" />
                </div>
                <div className="absolute inset-0 bg-gray-900/30"></div>
                <div className="relative max-w-lg px-4 mx-auto sm:px-0">
                    <div className="overflow-hidden bg-white rounded-md shadow-md">
                        <div className="px-4 py-6 sm:px-8 sm:py-7">
                            <div className="absolute top-6 left-4 cursor-pointer text-black" onClick={() => window.history.back()}>
                                <FaArrowLeft size={24} />
                            </div>
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
                                <p className="mt-2 text-base text-gray-600">
                                    Enter your new password below to reset your account.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="mt-8">
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-base font-medium text-gray-900">New Password</label>
                                        <div className="relative mt-2.5">
                                            <input
                                                type={isPasswordVisible ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="block w-full p-2 text-black placeholder-gray-500 border border-gray-200 rounded-md focus:outline-none focus:border-green-600"
                                                placeholder="Enter new password"
                                            />
                                            <span
                                                className="absolute right-3 top-3 cursor-pointer"
                                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                            >
                                                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                                            </span>
                                            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-base font-medium text-gray-900">Confirm Password</label>
                                        <div className="mt-2.5">
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="block w-full p-2 text-black placeholder-gray-500 border border-gray-200 rounded-md focus:outline-none focus:border-green-600"
                                                placeholder="Confirm your password"
                                            />
                                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                                        </div>
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                                        >
                                            Change Password
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

export default ResetPassword;
