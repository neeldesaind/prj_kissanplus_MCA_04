import { useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-hot-toast";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  const criteria = {
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /\d/.test(newPassword),
    specialChar: /[@$!%*?&]/.test(newPassword),
    minLength: newPassword.length >= 8,
  };

  const validatePassword = () => Object.values(criteria).every(Boolean);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (loading) return;

    toast.dismiss(); // Dismiss previous toasts

    if (!validatePassword()) {
      setError("Password must meet all requirements.");
      toast.error("Ensure the password meets all requirements!", { duration: 3000, position: "top-center" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmError("New password and confirm password do not match");
      toast.error("Passwords do not match!", { duration: 3000, position: "top-center" });
      return;
    }

    setError("");
    setConfirmError("");
    setLoading(true);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found. Please log in again.");
      toast.error("User ID missing. Please log in again.", { duration: 3000, position: "top-center" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/users/change-password/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Password changed successfully!", { duration: 3000, position: "top-center" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Failed to change password");
        toast.error(data.message || "Error changing password", { duration: 3000, position: "top-center" });
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.", err);
      toast.error("Something went wrong. Please try again later.", { duration: 3000, position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-[#1b1c1c] dark:text-white">
      <div className="w-96 p-6 shadow-lg rounded-2xl bg-white dark:bg-black dark:text-white">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center dark:bg-black dark:text-white">Change Password</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:bg-black dark:text-white">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-1 w-full border rounded p-2 dark:bg-[#1b1c1c] dark:text-white"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:bg-black dark:text-white">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 w-full border rounded p-2 pr-10 dark:bg-[#1b1c1c] dark:text-white"
                autoComplete="off"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 dark:bg-black dark:text-white">Must contain:</p>
            <ul className="text-xs text-gray-600 space-y-1 mt-1 dark:bg-black dark:text-white">
              {Object.entries(criteria).map(([key, value]) => (
                <li key={key} className="flex items-center">
                  {value ? <FaCheckCircle className="w-4 h-4 text-green-500" /> : <FaTimesCircle className="w-4 h-4 text-red-500" />}
                  <span className="ml-2">
                    {key === "uppercase" && "One uppercase letter"}
                    {key === "lowercase" && "One lowercase letter"}
                    {key === "number" && "One number"}
                    {key === "specialChar" && "One special character"}
                    {key === "minLength" && "Minimum 8 characters"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:bg-black dark:text-white">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 w-full border rounded p-2 pr-10 dark:bg-[#1b1c1c] dark:text-white"
                autoComplete="off"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {confirmError && <p className="text-red-500 text-xs mt-1">{confirmError}</p>}
          </div>
          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
