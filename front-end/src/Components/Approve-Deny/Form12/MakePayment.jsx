import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Lottie from "react-lottie";
import loadingAnimation from "../../../assets/lottie/loadingAnime.json";
import DataTable from "react-data-table-component";

const TotalRatesByUser = () => {
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setError("User ID not found in local storage.");
    }
  }, []);

  const fetchTotalRates = async () => {
    if (!userId) return;
  
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/form12/total-rates/${userId}`);
      const result = response.data;
  
      if (!result || !result.form12Details || result.form12Details.length === 0) {
        // If form12Details is empty, show pending approval message
        setError("Your rates are under review and will be available once approved by the engineer.");
        setData([]);
      } else {
        const tableData = result.form12Details.map((form12) => ({
          form_12_id: form12.form_12_id,
          ratePerVigha: form12.rate_per_vigha,
          totalRate: form12.total_rate,
          totalAmount: result.totalAmount,
          paymentStatus: form12.paymentStatus,
          fullName: result.fullName,
          cropName: result.cropName,
        }));
        setData(tableData);
        setError(null); // Clear any previous error
      }
    } catch (err) {
      console.error(err);
      const backendMessage = err.response?.data?.message;
    
      if (
        backendMessage?.includes("No approved Form12 entries found")
      ) {
        setError("No approved rate entries available yet. Please check back once the engineer approves your details.");
      } else {
        setError("Something went wrong while fetching your rate details. Please try again later.");
      }
    }
     finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    if (userId) fetchTotalRates();
  }, [userId]);

  const handlePayment = async (amount, form12Id) => {
    if (!amount || amount <= 0) {
      toast.error("Invalid payment amount.");
      return;
    }
  
    try {
      setPaymentProcessing(true);
      const response = await axios.post(`${BASE_URL}/api/create-order`, { amount });
      const { orderId } = response.data;
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        order_id: orderId,
        name: "Payment for Total Rate",
        description: "Payment for the total rate calculated",
        image: "/public/Logo/Logo.png",
        handler: async function (response) {
          const paymentData = {
            form12Id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            userId,
            amount,
            status: "success",
          };
  
          try {
            const paymentResponse = await axios.post(`${BASE_URL}/api/save-payment`, paymentData);
            if (paymentResponse.data.message === "Payment saved successfully") {
              toast.success("Payment Successful!");
              setData((prev) =>
                prev.map((item) =>
                  item.form_12_id === form12Id
                    ? { ...item, paymentStatus: "success" } // Update only the matching form_12_id
                    : item
                )
              );
            } else {
              toast.error("Payment failed!");
            }
          } catch (err) {
            toast.error("Error during payment verification and saving.");
            console.error(err);
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: data[0]?.fullName,
          email: "example@example.com",
          contact: "+911234567890",
        },
        notes: {
          address: "Some address",
        },
        theme: {
          color: "#4CAF50", // Button color
          font: {
            family: "Arial, sans-serif", // Custom font
            size: "16px", // Font size
            weight: "bold", // Font weight
          },
          textColor: "#333", // General text color
        },
        modal: {
          ondismiss: () => setPaymentProcessing(false),
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Failed to initialize payment");
      console.error(err);
      setPaymentProcessing(false);
    }
  };
  

  const columns = [
   
    {
      name: "Full Name",
      selector: (row) => row.fullName,
      sortable: true,
    },
    {
      name: "Crop Name",
      selector: (row) => row.cropName,
      sortable: true,
    },
    {
      name: "Rate Per Vigha",
      selector: (row) => row.ratePerVigha,
      sortable: true,
    },
    {
      name: "Total Rate",
      selector: (row) => row.totalRate,
      sortable: true,
    },
    {
      name: "Payment Status",
      selector: (row) => row.paymentStatus,
      cell: (row) => (
        <span
          className={`px-2 py-1 text-sm font-semibold rounded-full ${
            row.paymentStatus === "success"
              ? "bg-green-200 text-green-800"
              : "bg-yellow-200 text-yellow-800"
          }`}
        >
           {row.paymentStatus === "success" ? "Paid" : "Pending"}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          onClick={() => handlePayment(row.totalRate, row.form_12_id)} // Pass form_12_id for the specific record
          disabled={row.paymentStatus === "success"}
          className={`px-4 py-2 rounded-md text-white ${
            row.paymentStatus === "success" ? "bg-green-500 cursor-not-allowed" : "bg-green-500"
          }`}
        >
          {row.paymentStatus === "success" ? "Done" : "Make Payment"}
        </button>
      ),
    },
  ];

  return (
    <div className="flex bg-gray-100 justify-center p-4 ml-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-5xl relative">
        {paymentProcessing && (
          <div className="absolute inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 rounded-lg">
            <Lottie
              options={{
                animationData: loadingAnimation,
                loop: true,
                autoplay: true,
              }}
              height={150}
              width={150}
            />
          </div>
        )}

        <h1 className="text-2xl font-semibold text-gray-700 mb-4">Make Payments</h1>

        {loading && <p className="text-gray-500"> <Lottie
              options={{
                animationData: loadingAnimation,
                loop: true,
                autoplay: true,
              }}
              height={150}
              width={150}
            /></p>}
        {error && <p className="text-red-500">{error}</p>}

        {data.length > 0 && !loading && (
          <DataTable
            columns={columns}
            data={data}
            pagination
            highlightOnHover
            striped
            responsive
          />
        )}

        {data.length === 0 && !loading && !error && (
          <p className="text-gray-500">No data available for this user.</p>
        )}
      </div>
    </div>
  );
};

export default TotalRatesByUser;
