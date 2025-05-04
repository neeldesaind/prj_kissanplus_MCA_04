import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import PropTypes from "prop-types";
import loadingAnime from "../../../../assets/lottie/loadingAnime.json";
import Lottie from "lottie-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ViewProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate(); // Hook for navigation

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/users/view-user/${userId}`
        );
        setUser(response.data.user);
        setProfile(response.data.profile);
      } catch (err) {
        setError("Failed to fetch user details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 mt-10">{error}</div>;

  // Handle the back navigation
  const handleBack = () => {
    navigate("/side-bar/view-users"); // Redirect to the list page
  };

  ProfileField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8 ml-50 dark:bg-[#1b1c1c] dark:text-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 transition hover:shadow-xl duration-300 dark:bg-black dark:text-gray-100">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-8 dark:bg-black dark:text-gray-100">
          <img
            src={profile?.avatar || "/Default-Profile/profile-default.jpg"}
            alt="Avatar"
            className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md ring-4 ring-indigo-200 mb-4"
          />
          <h2 className="text-3xl font-semibold text-gray-800 dark:bg-black dark:text-gray-100">
            {user.firstName} {user.middleName || ""} {user.lastName}
          </h2>
          <p className="text-gray-500 dark:bg-black dark:text-gray-100">{user.email}</p>
        </div>

        {/* Profile Details - Centered Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 ">
          <ProfileField label="Phone" value={profile?.phone || "N/A"} />
          <ProfileField label="Address" value={profile?.address || "N/A"} />
          <ProfileField
            label="Aadhar Number"
            value={profile?.aadhar_number || "N/A"}
          />
          <ProfileField label="Gender" value={profile?.gender || "N/A"} />
          <ProfileField
            label="State"
            value={profile?.state_id?.state_name || "N/A"}
          />
          <ProfileField
            label="District"
            value={profile?.district_id?.district_name || "N/A"}
          />
          <ProfileField
            label="Sub-District"
            value={profile?.subdistrict_id?.subdistrict_name || "N/A"}
          />
          <ProfileField
            label="Village"
            value={profile?.village_id?.village_name || "N/A"}
          />
        </div>

        {/* Back to List Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="flex flex-col gap-2">
    <span className="text-sm font-semibold text-gray-500 dark:bg-black dark:text-gray-100">{label}</span>
    <span className="text-lg font-medium text-gray-800 dark:bg-black dark:text-gray-100">{value}</span>
  </div>
);

export default ViewProfile;
