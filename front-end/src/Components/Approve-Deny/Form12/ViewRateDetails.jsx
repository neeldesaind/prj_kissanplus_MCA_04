import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import loadingAnime from "../../../assets/lottie/loadingAnime.json";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ViewRateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form12, setForm12] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchForm12 = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/form12/${id}`);
      const data = res.data;
  
      // Normalize dates
      if (data.approvedByEngineerAt?.$date) {
        data.approvedByEngineerAt = data.approvedByEngineerAt.$date;
      }
      if (data.deniedByEngineerAt?.$date) {
        data.deniedByEngineerAt = data.deniedByEngineerAt.$date;
      }
      if (data.date_of_supply?.$date) {
        data.date_of_supply = data.date_of_supply.$date;
      }
  
      setForm12(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching form12:", error);
      toast.error("Failed to load form12 details.");
    }
  };

  useEffect(() => {
    fetchForm12();
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/form12/approve/${id}`);
      toast.success("Form12 approved successfully");
      navigate("/side-bar/approve-deny-form12"); // ✅ Back to list
    } catch (error) {
      console.error("Error approving form12:", error);
      toast.error("Failed to approve form12.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeny = async () => {
    setActionLoading(true);
    try {
      await axios.put(`${BASE_URL}/api/form12/deny/${id}`);
      toast.success("Form12 denied successfully");
      navigate("/side-bar/approve-deny-form12"); // ✅ Back to list
    } catch (error) {
      console.error("Error denying form12:", error);
      toast.error("Failed to deny form12.");
    } finally {
      setActionLoading(false);
    }
  };

  const renderApprovalStatus = () => {
    if (form12.isApprovedByEngineer) {
      const approvedDate = form12.approvedByEngineerAt
        ? new Date(form12.approvedByEngineerAt).toLocaleString()
        : "Not Available";
  
      return (
        <p><strong>Status:</strong> <span className="text-green-500">Approved at {approvedDate}</span></p>
      );
    } else if (form12.isDeniedByEngineer) {
      const deniedDate = form12.deniedByEngineerAt
        ? new Date(form12.deniedByEngineerAt).toLocaleString()
        : "Not Available";
  
      return (
        <p><strong>Status:</strong> <span className="text-red-500">Denied at {deniedDate}</span></p>
      );
    } else {
      return <p><strong>Status:</strong> <span className="text-orange-500">Pending</span></p>;
    }
  };
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8 dark:bg-black dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4 dark:bg-black dark:text-gray-100">Form12 Details</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 dark:bg-black dark:text-gray-100">
        <div>
          <p><strong>Farmer Name:</strong> {form12.farmerName}</p>
          <p><strong>Survey Number:</strong> {form12.surveyNumber}</p>
          <p><strong>Farm Area:</strong> {form12.farmArea}</p>
          <p><strong>Requested Area:</strong> {form12.requestedArea}</p>
          <p><strong>Source Type:</strong> {form12.sourceType}</p>
          <p><strong>Crop Name:</strong> {form12.cropName}</p>
        </div>
        <div>
          <p><strong>Date of Supply:</strong> {form12.date_of_supply?.$date ? new Date(form12.date_of_supply.$date).toLocaleDateString() : (form12.date_of_supply ? new Date(form12.date_of_supply).toLocaleDateString() : "Not Available")}</p>
          <p><strong>Rate per Vigha:</strong> {form12.rate_per_vigha}</p>
          <p><strong>Total Rate:</strong> {form12.total_rate}</p>
          {renderApprovalStatus()}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleApprove}
          disabled={actionLoading || form12.isApprovedByEngineer || form12.isDeniedByEngineer}
          className={`px-4 py-2 rounded text-white ${form12.isApprovedByEngineer || form12.isDeniedByEngineer ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
        >
          Approve
        </button>

        <button
          onClick={handleDeny}
          disabled={actionLoading || form12.isApprovedByEngineer || form12.isDeniedByEngineer}
          className={`px-4 py-2 rounded text-white ${form12.isApprovedByEngineer || form12.isDeniedByEngineer ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'}`}
        >
          Deny
        </button>

        <button
          onClick={() => navigate("/side-bar/approve-deny-form12")}
          className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ViewRateDetails;
