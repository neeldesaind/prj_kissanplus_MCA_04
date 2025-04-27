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

const ViewNoc = () => {
  const [nocData, setNocData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { nocId } = useParams();
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
    striped: {
      style: {
        backgroundColor: isDarkMode ? "#232323" : "#f9f9f9",
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
    const fetchNocDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/noc/${nocId}`);
        setNocData(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NOC:", error);
        toast.error("Failed to load NOC.");
        setLoading(false);
      }
    };

    fetchNocDetails();
  }, [nocId]);

  const handleApprove = async () => {
    try {
      await axios.put(`${BASE_URL}/api/noc/approve/${nocId}`);
      setNocData((prevData) => ({
        ...prevData,
        isApprovedbyTalati: true,
        isDeniedByTalati: false,
        isApprovedbyTalatiAt: new Date().toISOString(),
        isDeniedByTalatiAt: null
      }));
      toast.success("NOC approved!");
      navigate("/side-bar/approve-deny-noc");
    } catch (error) {
      console.error("Error approving NOC:", error);
      toast.error("Failed to approve NOC.");
    }
  };

  const handleDeny = async () => {
    try {
      await axios.put(`${BASE_URL}/api/noc/deny/${nocId}`);
      setNocData((prevData) => ({
        ...prevData,
        isApprovedbyTalati: false,
        isDeniedByTalati: true,
        isApprovedbyTalatiAt: null,
        isDeniedByTalatiAt: new Date().toISOString()
      }));
      toast.success("NOC denied!");
      navigate("/side-bar/approve-deny-noc");
    } catch (error) {
      console.error("Error denying NOC:", error);
      toast.error("Failed to deny NOC.");
    }
  };

  const renderStatus = () => {
    if (nocData?.isApprovedbyTalati) {
      return <span className="text-green-600 font-semibold">Approved</span>;
    } else if (nocData?.isDeniedbyTalati) { // Fixed to use 'isDeniedbyTalati' with lowercase 'b'
      return <span className="text-red-600 font-semibold">Denied</span>;
    } else {
      return <span className="text-orange-500 font-semibold">Pending</span>;
    }
  };
  
  

  const renderApprovalDate = () => {
    if (nocData?.isApprovedbyTalatiAt) {
      const approvalDate = new Date(nocData.isApprovedbyTalatiAt);
      return (
        <span className="font-bold text-green-600">
          {approvalDate.toLocaleString()}
        </span>
      );
    }
    return "Not Available";
  };
  
  const renderDenialDate = () => {
    if (nocData?.isDeniedByTalatiAt) {
      const denialDate = new Date(nocData.isDeniedByTalatiAt);
      return (
        <span className="font-bold text-red-600">
          {denialDate.toLocaleString()}
        </span>
      );
    }
    return "Not Available";
  };
  
  const renderFarmerName = () => {
    const user = nocData?.profile_id?.user_id;
    if (user) {
      const { firstName, middleName, lastName } = user;
      return `${firstName || ""} ${middleName || ""} ${lastName || ""}`.trim() || "Farmer Name Not Available";
    }
    return "Farmer Name Not Available";
  };

  const columns = [
    { name: "State", selector: row => row.state_id?.state_name || "Not Available" },
    { name: "District", selector: row => row.district_id?.district_name || "Not Available" },
    { name: "Sub-District", selector: row => row.subdistrict_id?.subdistrict_name || "Not Available" },
    { name: "Village", selector: row => row.village_id?.village_name || "Not Available" },
    { name: "Survey Number", selector: row => row.surveyNumber || "Not Available" },
    { name: "POAT Number", selector: row => row.poatNumber || "Not Available" },
    { name: "Farm Area", selector: row => row.farmArea || "Not Available" },
  ];

  const data = nocData?.farm_ids || [];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );

  if (!nocData) {
    return <div className="dark:bg-black dark:text-gray-100">NOC not found</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mb-10 mt-6 ml-80 dark:bg-[#1b1c1c] dark:text-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 dark:bg-black dark:text-gray-100">
        <h1 className="text-2xl font-bold text-center mb-2">NOC Details</h1>

        <div className="mb-4">
          <strong>NOC ID:</strong> {nocData.noc_id}
        </div>
        <div className="mb-4">
          <strong>Farmer Name:</strong> {renderFarmerName()}
        </div>
        <div className="mb-4">
          <strong>Reason for NOC:</strong> {nocData.reason_for_noc}
        </div>
        <div className="mb-4 dark:bg-black dark:text-gray-100">
          <strong>Status:</strong> {renderStatus()}
        </div>
        {nocData?.isApprovedbyTalatiAt && (
          <div className="mb-4 dark:bg-black dark:text-gray-100">
            <strong>Approved On:</strong> {renderApprovalDate()}
          </div>
        )}
        {nocData?.isDeniedByTalatiAt && (
          <div className="mb-4 dark:bg-black dark:text-gray-100">
            <strong>Denied On:</strong> {renderDenialDate()}
          </div>
        )}

        <div className="mb-4 dark:bg-black dark:text-gray-100">
          <strong>Farm Details:</strong>
          <DataTable
            columns={columns}
            data={data}
            pagination
            responsive
            customStyles={customStyles}
          />
        </div>

        <div className="flex justify-between mt-6 dark:bg-black dark:text-gray-100">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/side-bar/approve-deny-noc")}
          >
            Back to List
          </button>
          <div className="flex gap-2">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleApprove}
              disabled={nocData.isApprovedbyTalati || nocData.isDeniedByTalati}
            >
              <BsFillCheckCircleFill className="mr-2" />
              Approve
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDeny}
              disabled={nocData.isApprovedbyTalati || nocData.isDeniedByTalati}
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

export default ViewNoc;
