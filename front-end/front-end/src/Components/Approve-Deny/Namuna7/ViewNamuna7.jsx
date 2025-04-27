import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { BsFillCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import DataTable from "react-data-table-component"; // Import DataTable
import loadingAnime from "../../../assets/lottie/loadingAnime.json";
import Lottie from "lottie-react";
import { useDarkMode } from "../../Context/useDarkMode";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ViewNamuna7 = () => {
  const { namuna_id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const formatDateTime = (dateStr) => new Date(dateStr).toLocaleString();
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
    const fetchApplication = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/namuna7/${namuna_id}`);
        setApplication(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Namuna7 application:", error);
        toast.error("Failed to load application details.");
      }
    };

    fetchApplication();
  }, [namuna_id]);

  const handleApprove = async () => {
    try {
      await axios.put(`${BASE_URL}/api/namuna7/${namuna_id}/approve`);
      setApplication((prevData) => ({
        ...prevData,
        isApprovedbyTalati: true,
        isDeniedbyTalati: false,
        approvedByTalatiAt: new Date().toISOString(),
      }));
      toast.success("Application approved!");
      navigate("/side-bar/view-namuna");
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve the application.");
    }
  };

  const handleDeny = async () => {
    try {
      await axios.put(`${BASE_URL}/api/namuna7/${namuna_id}/deny`);
      setApplication((prevData) => ({
        ...prevData,
        isApprovedbyTalati: false,
        isDeniedbyTalati: true,
        deniedByTalatiAt: new Date().toISOString(),
      }));
      toast.success("Application denied!");
      navigate("/side-bar/view-namuna");
    } catch (error) {
      console.error("Denial error:", error);
      toast.error("Failed to deny the application.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
      <Lottie animationData={loadingAnime} className="w-40 h-40" />
    </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        Application not found.
      </div>
    );
  }

  const {
    profile_id,
    isApprovedbyTalati,
    isDeniedbyTalati,
    createdAt,
    updatedAt,
    farmDetails,
    source_type,
    dues_Clear_till,
    dues_crop_name,
    isOwner,
  } = application;
  const user = profile_id?.user_id;

  const columns = [
    {
      name: "Village",
      selector: (row) => row.village_name,
      sortable: true,
    },
    {
      name: "Survey No",
      selector: (row) => row.surveyNumber,
      sortable: true,
    },
    {
      name: "Poat No",
      selector: (row) => row.poatNumber,
      sortable: true,
    },
    {
      name: "Area",
      selector: (row) => row.farmArea,
      sortable: true,
    },
    {
      name: "Canal",
      selector: (row) => row.canal_name,
      sortable: true,
    },
    {
      name: "Crop Name",
      selector: (row) => row.crop_name,
      sortable: true,
    },
    {
      name: "Requested Area",
      selector: (row) => row.requested_area,
      sortable: true,
    },
    {
      name: "Irrigation Year",
      selector: (row) => new Date(row.irrigationYear).toLocaleDateString(),
      sortable: true,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-6 mb-10 ml-80 bg-white shadow-md rounded-lg p-6 dark:bg-black dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Namuna 7 Application Details
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <strong>Application ID:</strong> {application.namuna_id}
        </div>
        <div>
          <strong>Date:</strong> {new Date(createdAt).toLocaleDateString()}
        </div>
        <div>
          <strong>Updated:</strong> {new Date(updatedAt).toLocaleDateString()}
        </div>
        <div>
          <strong>Status:</strong>
          <span
            className={
              isApprovedbyTalati
                ? "text-green-600 font-semibold"
                : isDeniedbyTalati
                ? "text-red-600 font-semibold"
                : "text-orange-500 font-semibold"
            }
          >
            {isApprovedbyTalati
              ? "Approved"
              : isDeniedbyTalati
              ? "Denied"
              : "Pending"}
          </span>
        </div>
        {isApprovedbyTalati && application.approvedByTalatiAt && (
  <div>
    <strong>Approved At:</strong>{" "}
    <span className="text-green-600 font-bold">
      {formatDateTime(application.approvedByTalatiAt)}
    </span>
  </div>
)}

{isDeniedbyTalati && application.deniedByTalatiAt && (
  <div>
    <strong>Denied At:</strong>{" "}
    <span className="text-red-600 font-bold">
      {formatDateTime(application.deniedByTalatiAt)}
    </span>
  </div>
)}

        <div>
          <strong>Farmer Name:</strong>{" "}
          {user
            ? `${user.firstName} ${user.middleName || ""} ${
                user.lastName || ""
              }`
            : "Unknown"}
        </div>
        <div>
          <strong>Ownership:</strong> {isOwner ? "Owner" : "Not Owner"}
        </div>
        <div>
          <strong>Source Type:</strong> {source_type || "N/A"}
        </div>
        <div>
          <strong>Dues Clear Till:</strong>{" "}
          {new Date(dues_Clear_till).toLocaleDateString() || "N/A"}
        </div>
        <div>
          <strong>Dues Crop Name:</strong> {dues_crop_name || "N/A"}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Farm Details</h2>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={farmDetails}
          pagination
          responsive
          customStyles={customStyles}
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/side-bar/view-namuna")}
        >
          Back to List
        </button>
        <div className="flex gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleApprove}
            disabled={isApprovedbyTalati || isDeniedbyTalati}
          >
            <BsFillCheckCircleFill className="mr-2" />
            Approve
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDeny}
            disabled={isApprovedbyTalati || isDeniedbyTalati}
          >
            <BsFillXCircleFill className="mr-2" />
            Deny
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNamuna7;
