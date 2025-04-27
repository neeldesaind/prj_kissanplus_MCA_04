import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { BsFillCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import DataTable from "react-data-table-component";
import loadingAnime from "../../../assets/lottie/loadingAnime.json";
import Lottie from "lottie-react";
import { useDarkMode } from "../../Context/useDarkMode";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ViewExemption = () => {
  const [exemptionData, setExemptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { exemptionId } = useParams();
  const navigate = useNavigate();
  const { theme } = useDarkMode();

  const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);


  const customStyles = {
    table: {
      style: {
        backgroundColor: isDarkMode ? "#1b1c1c" : "#fff",
      },
    },
    headRow: {
      style: {
        backgroundColor: isDarkMode ? "#2c2c2c" : "#f0f0f0",
        color: isDarkMode ? "#fff" : "#000",
      },
    },
    headCells: {
      style: {
        color: isDarkMode ? "#fff" : "#000",
      },
    },
    rows: {
      style: {
        backgroundColor: isDarkMode ? "#1b1c1c" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      },
    },
    pagination: {
      style: {
        backgroundColor: isDarkMode ? "#1b1c1c" : "#fff",
        color: isDarkMode ? "#fff" : "#000",
      },
    },
  };



  useEffect(() => {
    const fetchExemptionDetails = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/exemptions/${exemptionId}`
        );
        setExemptionData(res.data); // Always fetch the latest exemption data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exemption:", error);
        toast.error("Failed to load exemption.");
        setLoading(false);
      }
    };

    fetchExemptionDetails();
  }, [exemptionId]); // Ensure this runs whenever the exemptionId changes

  const handleApprove = async () => {
    try {
      // Make the API request to approve the exemption
      await axios.put(
        `${BASE_URL}/api/exemptions/${exemptionId}/approve`
      );
      
      // Update state immediately after approval
      setExemptionData((prevData) => ({
        ...prevData,
        isApprovedbyTalati: true, // Update to approved status
        isDeniedbyTalati: false, // Ensure the denied status is false
        isApprovedbyTalatiAt: new Date().toISOString(), // Set approval timestamp
        isDeniedbyTalatiAt: null, // Reset denial timestamp
      }));

      toast.success("Exemption approved!");
      navigate("/side-bar/approve-deny-exemption"); // Redirect after approval
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve exemption.");
    }
  };

  const handleDeny = async () => {
    try {
      // Make the API request to deny the exemption
      await axios.put(
        `${BASE_URL}/api/exemptions/${exemptionId}/deny`
      );
      
      // Update state immediately after denial
      setExemptionData((prevData) => ({
        ...prevData,
        isApprovedbyTalati: false, // Update to denied status
        isDeniedbyTalati: true, // Ensure the denied status is true
        isApprovedbyTalatiAt: null, // Reset approval timestamp
        isDeniedbyTalatiAt: new Date().toISOString(), // Set denial timestamp
      }));

      toast.success("Exemption denied!");
      navigate("/side-bar/approve-deny-exemption"); // Redirect after denial
    } catch (error) {
      console.error("Denial error:", error);
      toast.error("Failed to deny exemption.");
    }
  };

  const renderStatus = () => {
    const approvedAt = exemptionData?.isApprovedbyTalatiAt
      ? new Date(exemptionData.isApprovedbyTalatiAt).toLocaleString()
      : null;
    const deniedAt = exemptionData?.isDeniedbyTalatiAt
      ? new Date(exemptionData.isDeniedbyTalatiAt).toLocaleString()
      : null;

    if (exemptionData?.isApprovedbyTalati) {
      return (
        <span className="text-green-600 font-semibold">
          Approved at: {approvedAt}
        </span>
      );
    } else if (exemptionData?.isDeniedbyTalati) {
      return (
        <span className="text-red-600 font-semibold">
          Denied at: {deniedAt}
        </span>
      );
    } else {
      return <span className="text-orange-500 font-semibold">Pending</span>;
    }
  };

  const renderFarmerName = () => {
    const user = exemptionData?.profile_id?.user_id;
    if (user) {
      const { firstName, middleName, lastName } = user;
      return (
        `${firstName || ""} ${middleName || ""} ${lastName || ""}`.trim() ||
        "Farmer Name Not Available"
      );
    }
    return "Farmer Name Not Available";
  };

  const columns = [
    { name: "Village", selector: (row) => row.village_name || "Not Available" },
    {
      name: "Survey Number",
      selector: (row) => row.surveyNumber || "Not Available",
    },
    {
      name: "POAT Number",
      selector: (row) => row.poatNumber || "Not Available",
    },
    { name: "Farm Area", selector: (row) => row.farmArea || "Not Available" },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen dark:bg-black dark:text-gray-100">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );
  if (!exemptionData) return <div>Exemption not found</div>;

  const NoDataComponent = () => (
    <div
      className={`w-full py-2 text-center text-xl font-semibold ${
        isDarkMode ? "text-gray-300 bg-[#1b1c1c]" : "text-gray-600 bg-white"
      }`}
    >
      There are no records to display
    </div>
  );


  return (
    <div className="max-w-5xl mx-auto mb-10 mt-6 ml-80 dark:bg-[#1b1c1c] dark:text-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 dark:bg-black dark:text-gray-100">
        <h1 className="text-2xl font-bold text-center mb-2 dark:bg-black dark:text-gray-100">
          Exemption Details
        </h1>

        <div className="mb-4">
          <strong>Exemption ID:</strong> {exemptionData.exemption_id}
        </div>
        <div className="mb-4">
          <strong>Farmer Name:</strong> {renderFarmerName()}
        </div>
        <div className="mb-4">
          <strong>Date of Well:</strong>{" "}
          {new Date(exemptionData.date_of_well).toLocaleDateString()}
        </div>
        <div className="mb-4">
          <strong>Own Well:</strong> {exemptionData.isOwnWell ? "Yes" : "No"}
        </div>
        <div className="mb-4">
          <strong>Owner of Land:</strong> {exemptionData.isOwner ? "Yes" : "No"}
        </div>
        <div className="mb-4">
          <strong>Status:</strong> {renderStatus()}
        </div>

        <div className="mb-4 dark:bg-black dark:text-gray-100">
          <strong>Farm Details:</strong>
          <DataTable
            columns={columns}
            data={exemptionData.farmDetails}
            pagination
            responsive
            customStyles={customStyles}
            noDataComponent={<NoDataComponent />} 
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/side-bar/approve-deny-exemption")}
          >
            Back to List
          </button>
          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleApprove}
              disabled={exemptionData.isApprovedbyTalati || exemptionData.isDeniedbyTalati}
            >
              <BsFillCheckCircleFill className="mr-2" />
              Approve
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDeny}
              disabled={exemptionData.isApprovedbyTalati || exemptionData.isDeniedbyTalati}
            >
              <BsFillXCircleFill className="mr-2" />
              Deny
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewExemption;
