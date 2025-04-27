import { useEffect, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import loadingAnime from "../../../assets/lottie/loadingAnime.json";
import Lottie from "lottie-react";
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

  useEffect(() => {
    const fetchForm12Data = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`${BASE_URL}/api/form12/getform12data`);
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
  
    newFormData[index].ratePerVigha = newRate;
    newFormData[index].totalRate = calculateTotalRate(newRate, newFormData[index].requestedArea);
  
    setFormData(newFormData);
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

  const handleSubmit = async () => {
    // Transform formData into the format your backend expects
    const transformedData = formData.map((row) => ({
      rate_per_vigha: row.ratePerVigha,
      total_rate: calculateTotalRate(row.ratePerVigha, row.requestedArea),
      namuna_id: row.namunaRefId,
      profile_id: row.profile_id,
    }));

    

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
      toast.error("Submission failed!");
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
          row.date_of_supply ||
          row.waterSupplyDate ||
          row.dateOfSupply ||
          null;
    
        const formattedDate = date
          ? new Date(date).toISOString().split("T")[0]
          : "";
    
        return (
          <input
            type="date"
            value={formattedDate}
            disabled
            className="border border-gray-300 w-full p-1 rounded text-sm bg-gray-100 text-gray-700"
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

  return (
    <div className="flex flex-col lg:flex-row ml-70 mt-1 ">
      {/* Main content with padding */}
      <div className=" rounded-lg p-4 w-9/9 relative">
        {/* Single Card to Wrap All Content */}
        <div className="card bg-white shadow-lg p-6 space-y-6">
          {/* Heading Section */}
          {/* Heading and Submit Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold mb-1">Form 12</h1>
              <h2 className="text-lg font-semibold">
                Approved Farm Details for Canal Water Source
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
              >
                Save
              </button>
              <button
                onClick={handleExport}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
              >
                Export to excel
              </button>
            </div>
          </div>

          <div className="mb-4 ml-40">
            <p className="flex flex-wrap items-center gap-2 text-center">
              <span>
                Farm with a canal as the water source, intended for land
                measurement and irrigation.
              </span>
              
            </p>
          </div>

          <div className="overflow-auto max-h-[500px] relative">
            <div className="flex justify-center mb-4">
              <input
                type="text"
                placeholder="Search by Farmer Name"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="p-2 border border-gray-400 rounded w-500"
              />
            </div>

            <DataTable
              title="Form 12: Approved Farm Details"
              columns={columns}
              data={filteredData}
              theme="customTheme"
              pagination
              highlightOnHover
              pointerOnHover
              striped
              responsive
              customStyles={{
                table: {
                  style: {
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                  },
                },
                headCells: {
                  style: {
                    fontWeight: "600",
                    backgroundColor: "#f1f5f9", // Gray-100
                    borderBottom: "1px solid #e5e7eb",
                    paddingLeft: "8px", // Reduce left padding
                    paddingRight: "8px", // Reduce right padding
                  },
                },
                rows: {
                  style: {
                    borderBottom: "1px solid #f3f4f6",
                    "&:hover": {
                      backgroundColor: "#f9fafb",
                    },
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
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form12;
