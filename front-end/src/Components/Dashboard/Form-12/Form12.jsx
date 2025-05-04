import { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import loadingAnime from "../../../assets/lottie/loadingAnime.json";
import Lottie from "lottie-react";
import { useDarkMode } from "../../Context/useDarkMode";
import toast from "react-hot-toast";

createTheme("customTheme", {
  text: {
    primary: "#1F2937", // Gray-800
    secondary: "#4B5563", // Gray-600
  },
  background: {
    default: "#ffffff",
  },
  context: {
    background: "#e2e8f0", // Gray-200
    text: "#1F2937",
  },
  divider: {
    default: "#e5e7eb", // Gray-300
  },
  button: {
    default: "#3B82F6", // green-500
    hover: "#2563EB", // green-600
    focus: "#1D4ED8",
    disabled: "#9CA3AF", // Gray-400
  },
  sortFocus: {
    default: "#6B7280", // Gray-500
  },
});

const Form12 = () => {
  const [formData, setFormData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const { theme } = useDarkMode();

  const isDarkMode =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const customStyles = {
    table: {
      style: {
        border: "1px solid #1b1c1c",
        backgroundColor: isDarkMode ? "#1b1c1c" : "#fff",
        borderRadius: "0.5rem",
        overflow: "hidden",
      },
    },

    headRow: {
      style: {
        backgroundColor: isDarkMode ? "#1b1c1c" : "#f0f0f0",
        color: isDarkMode ? "#fff" : "#000",
      },
    },
    headCells: {
      style: {
        fontWeight: "600",
        backgroundColor: isDarkMode ? "#1b1c1c" : "#f1f5f9", // Gray-100
        borderBottom: isDarkMode ? "#000" : "1px solid #e5e7eb",
        paddingLeft: "8px", // Reduce left padding
        paddingRight: "8px", // Reduce right padding
        color: isDarkMode ? "#fff" : "#000",
      },
    },
    rows: {
      style: {
        borderBottom: isDarkMode ? "#000" : "1px solid #e5e7eb",
        "&:hover": {
          backgroundColor: isDarkMode ? "#000" : "1px solid #f9fafb",
        },
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
    cells: {
      style: {
        paddingTop: "10px",
        paddingBottom: "10px",
        paddingLeft: "6x",
        paddingRight: "6px",
      },
    },
  };

  useEffect(() => {
    const fetchForm12Data = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(
          `${BASE_URL}/api/form12/getform12data`
        );
        const data = response.data;

        if (Array.isArray(data)) {
          setFormData(data);
        } else {
          console.warn("Expected an array but got:", data);
          setFormData([]);
        }
      } catch (error) {
        console.error("Failed to fetch Form 12 data", error);
        setFormData([]);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchForm12Data();
  }, []);

  const handleRateChange = (e, index) => {
    const newRate = parseFloat(e.target.value) || 0;
    const newFormData = [...formData];
  
    newFormData[index] = {
      ...newFormData[index],
      ratePerVigha: newRate,
      totalRate: calculateTotalRate(newRate, newFormData[index].requestedArea),
    };
  
    setFormData(newFormData); // Update state correctly for the specific row
  };
  

  // const handleTotalRateChange = (e, index) => {
  //   const newFormData = [...formData];
  //   newFormData[index].totalRate = e.target.value;
  //   setFormData(newFormData);
  // };

  const calculateTotalRate = (ratePerVigha, requestedArea) => {
    return ratePerVigha && requestedArea ? ratePerVigha * requestedArea : 0;
  };

  const filteredData = formData.filter((item) =>
    item.farmerName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleExport = () => {
    const exportData = formData.map((row) => ({
      Namuna_ID: row.namunaId,
      Survey_Number: row.surveyNumber,

      Total_Area: row.farmArea,
      Approved_Area: row.requestedArea,
      Farmer_Name: row.farmerName,
      Source_Type: row.sourceType,
      Crop_Name: row.cropName,
      Rate_Per_Hectare: row.ratePerVigha,
      Date_Of_Water_Supply: row.waterSupplyDate,
      Total_Rate: calculateTotalRate(row.ratePerVigha, row.requestedArea),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Form12Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Form12Data.xlsx");
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    toast.dismiss(); 
    if (isSubmitting) return; // Prevent double submit

    const transformedData = formData.map((row) => ({
      rate_per_vigha: row.ratePerVigha,
      total_rate: calculateTotalRate(row.ratePerVigha, row.requestedArea),
      namuna_id: row.namunaRefId,
      profile_id: row.profile_id,
    }));

    setIsSubmitting(true);

    try {
      console.log("Submitting transformed Form12 data:", transformedData);
      const response = await axios.post(
        `${BASE_URL}/api/form12/save`,
        transformedData
      );
      console.log("Form12 submitted:", response.data);
      toast.success("Form12 submitted successfully!");
    } catch (error) {
      console.error("Error submitting Form12:", error);
      toast.error(
        error.response?.data?.message || "Submission failed! Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      name: "Namuna ID",
      selector: (row) => row.namunaId,
      sortable: true,
      wrap: true,
      cell: (row) => <div className="p-2">{row.namunaId}</div>,
    },
    {
      name: "Survey Number",
      selector: (row) => row.surveyNumber,
      sortable: true,
      wrap: true,
      cell: (row) => <div className="p-2">{row.surveyNumber}</div>,
    },

    {
      name: "Total Area",
      selector: (row) => row.farmArea,
      sortable: true,
      wrap: true,
      cell: (row) => <div className="p-2">{row.farmArea}</div>,
    },
    {
      name: "Approved Area",
      selector: (row) => row.requestedArea,
      sortable: true,
      wrap: true,
      cell: (row) => <div className="p-2">{row.requestedArea}</div>,
    },
    {
      name: "Farmer Name",
      selector: (row) => row.farmerName,
      sortable: true,

      cell: (row) => <div className="p-2">{row.farmerName}</div>,
    },
    {
      name: "Source Type",
      selector: (row) => row.sourceType,
      sortable: true,
      cell: (row) => <div className="p-2">{row.sourceType}</div>,
    },
    {
      name: "Crop Name",
      selector: (row) => row.cropName,
      sortable: true,
      cell: (row) => <div className="p-2">{row.cropName}</div>,
    },
    {
      name: "Date of Supply",
      sortable: true,
      cell: (row) => {
        const date =
          row.date_of_supply || row.waterSupplyDate || row.dateOfSupply || null;

        const formattedDate = date
          ? new Date(date).toISOString().split("T")[0]
          : "";

        return (
          <input
            type="date"
            value={formattedDate}
            disabled
            className="border border-gray-300 w-full p-1 rounded text-sm bg-gray-100 text-gray-700 dark:bg-[#1b1c1c] dark:text-gray-100"
          />
        );
      },
    },
    {
      name: "Rate per Vigha",
      selector: (row) => row.ratePerVigha,
      cell: (row, index) => (
        <input
          type="number"
          value={row.ratePerVigha || ""}
          onChange={(e) => handleRateChange(e, index)}
          className="w-full p-1 border border-gray-300 rounded text-sm"
        />
      ),
    },

    {
      name: "Total Rate",
      selector: (row) =>
        calculateTotalRate(row.ratePerVigha, row.requestedArea),
      cell: (row) => (
        <input
          type="number"
          value={row.totalRate || ""}
          disabled
          className="w-full p-1 border border-gray-300 rounded text-sm"
        />
      ),
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );

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
    <div className="flex flex-col lg:flex-row ml-70 mt-1 dark:bg-[#1b1c1c] dark:text-gray-100">
      {/* Main content with padding */}
      <div className=" rounded-lg p-4 w-9/9 relative dark:bg-black dark:text-gray-100">
        {/* Single Card to Wrap All Content */}
        <div className="card bg-white shadow-lg p-6 space-y-6 dark:bg-black dark:text-gray-100">
          {/* Heading Section */}
          {/* Heading and Submit Button */}
          <div className="flex justify-between items-center mb-4 dark:bg-black dark:text-gray-100">
            <div className="flex-1 text-center dark:bg-black dark:text-gray-100">
              <h1 className="text-2xl font-bold mb-1 dark:bg-black dark:text-gray-100">
                Form 12
              </h1>
              <h2 className="text-lg font-semibold dark:bg-black dark:text-gray-100">
                Approved Farm Details for Canal Water Source
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
              >
                Export to excel
              </button>
            </div>
          </div>

          <div className="mb-4 ml-40 dark:bg-black dark:text-gray-100">
            <p className="flex flex-wrap items-center gap-2 text-center dark:bg-black dark:text-gray-100">
              <span>
                Farm with a canal as the water source, intended for land
                measurement and irrigation.
              </span>
            </p>
          </div>

          <div className="max-h-[500px] relative dark:bg-black dark:text-gray-100">
            <div className="flex justify-center mb-4 dark:bg-black dark:text-gray-100">
              <input
                type="text"
                placeholder="Search by Farmer Name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="p-2 border border-gray-400 rounded w-500 dark:bg-black dark:text-gray-100"
              />
            </div>

            <DataTable
              columns={columns}
              data={filteredData}
              theme="customTheme"
              pagination
              pointerOnHover
              responsive
              customStyles={customStyles}
              noDataComponent={<NoDataComponent />}
              className="dark:bg-black dark:text-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form12;
