  import { useEffect, useState } from "react";
  import axios from "axios";
  import toast from "react-hot-toast";
  import ReactDataTable from "react-data-table-component";
  import { FaSpinner } from "react-icons/fa"; // For loading spinner
  import * as XLSX from "xlsx";
  import { saveAs } from "file-saver";
  import { useDarkMode } from "../../Context/useDarkMode";
  import loadingAnime from "../../../assets/lottie/loadingAnime.json";
  import Lottie from "lottie-react";


  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const ApproveDenyForm12 = () => {
    const [form12s, setForm12s] = useState([]);
    const [filteredForm12s, setFilteredForm12s] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [loadingActions, setLoadingActions] = useState({}); // Track loading state per button
    const { theme } = useDarkMode();

    const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);


    const customStyles = {
      table: {
        style: {
          backgroundColor: isDarkMode ? "#2c2c2c" : "#fff",
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
          backgroundColor: isDarkMode ? "#2c2c2c" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
        },
      },
      pagination: {
        style: {
          backgroundColor: isDarkMode ? "#2c2c2c" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
        },
      },
    };

    const fetchForm12s = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/form12/all`);
        const data = res.data;
    
        // Remove duplicates based on survey number (assuming survey number is 'surveyNumber')
        const uniqueData = data.filter((value, index, self) =>
          index === self.findIndex((t) => (
            t.surveyNumber === value.surveyNumber
          ))
        );
    
        // Set form12s and filteredForm12s with unique data
        setForm12s(uniqueData);
        setFilteredForm12s(uniqueData);
    
        setLoading(false);
      } catch (error) {
        console.error("Error fetching form12s:", error);
        toast.error("Failed to load form12 applications.");
      }
    };

    useEffect(() => {
      fetchForm12s();
    }, []); // Only fetch on initial load

    // Handle search change to filter the data
    useEffect(() => {
      if (search.trim() === "") {
        setFilteredForm12s(form12s);  // If no search, reset the filtered list
      } else {
        const filtered = form12s.filter((row) =>
          row.farmerName.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredForm12s(filtered);
      }
    }, [search, form12s]);  // Only filter when search or form12s change

    const getStatus = (row) => {
      if (row.isApprovedByEngineer) {
        return <span className="text-green-600 font-semibold">Approved</span>;
      } else if (row.isDeniedByEngineer) {
        return <span className="text-red-600 font-semibold">Denied</span>;
      } else {
        return <span className="text-orange-500 font-semibold">Pending</span>;
      }
    };

    const handleAction = async (form12Id, actionType) => {
      setLoadingActions((prevState) => ({ ...prevState, [form12Id]: true }));

      try {
        const url = `${BASE_URL}/api/form12/${actionType}/${form12Id}`;
        await axios.put(url);

        // Update the local state to reflect the change immediately without duplicating
        const updatedForm12s = form12s.map((form12) =>
          form12.form12RefId === form12Id
            ? { ...form12, [actionType === "approve" ? "isApprovedByEngineer" : "isDeniedByEngineer"]: true }
            : form12
        );

        setForm12s(updatedForm12s);

        // Only update filteredForm12s if search query is present
        if (search.trim() !== "") {
          const filtered = updatedForm12s.filter((row) =>
            row.farmerName.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredForm12s(filtered);
        } else {
          setFilteredForm12s(updatedForm12s);  // Update without filtering if no search is applied
        }

        toast.success(`Form12 ${actionType}d successfully`);
      } catch (error) {
        console.error(`Error ${actionType}ing form12:`, error);
        toast.error(`Failed to ${actionType} form12.`);
      } finally {
        setLoadingActions((prevState) => ({ ...prevState, [form12Id]: false }));
      }
    };

    const handleExport = () => {
      const ws = XLSX.utils.json_to_sheet(filteredForm12s);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Form12 Applications");

      // Save the Excel file
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const excelBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(excelBlob, "Form12_Applications.xlsx");
    };

    const columns = [
      { name: "Farmer Name", selector: (row) => row.farmerName },
      { name: "Survey Number", selector: (row) => row.surveyNumber },
      { name: "Farm Area", selector: (row) => row.farmArea },
      { name: "Requested Area", selector: (row) => row.requestedArea,  },
      { name: "Source Type ", selector: (row) => row.sourceType, wrap: true },
      { name: "Crop Name", selector: (row) => row.cropName },
      {
        name: "Date of Supply",
        selector: (row) => new Date(row.date_of_supply).toLocaleDateString(),
      },
      {
        name: "Rate per Vigha",
        selector: (row) => row.rate_per_vigha,
        sortable: true,
      },
      { name: "Total Rate", selector: (row) => row.total_rate, sortable: true },
      {
        name: "Status",
        cell: (row) => getStatus(row),
      },
      {
        name: "Actions",
        cell: (row) => (
          <div className="flex space-x-1 ">
            <button
              onClick={() => handleAction(row.form12RefId, "approve")}
              className={`bg-green-500 w-25 hover:bg-green-600 text-white text-sm px-2 py-1 rounded ${
                row.isApprovedByEngineer || row.isDeniedByEngineer
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={row.isApprovedByEngineer || row.isDeniedByEngineer}
            >
              {loadingActions[row.form12RefId] ? (
                <FaSpinner className="animate-spin text-sm text-gray-600 bg-white" />
              ) : (
                "Approve"
              )}
            </button>

            <button
              onClick={() => handleAction(row.form12RefId, "deny")}
              className={`bg-red-500 w-25 hover:bg-red-600 text-white text-sm px-2 py-1 rounded ${
                row.isApprovedByEngineer || row.isDeniedByEngineer
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={row.isApprovedByEngineer || row.isDeniedByEngineer}
            >
              {loadingActions[row.form12RefId] ? (
                <FaSpinner className="animate-spin text-sm" />
              ) : (
                "Deny"
              )}
            </button>
          </div>
        ),
      },
    ];

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
      <div className="max-w-12xl mx-auto mt-6 mb-10 ml-70 dark:bg-black dark:text-gray-100">
        <div className="bg-white shadow-md rounded-lg p-6 dark:bg-[#2c2c2c] dark:text-gray-100">
          <div className="flex justify-between items-center mb-4 dark:bg-[#2c2c2c] dark:text-gray-100">
            <h1 className="text-2xl font-bold">Approve/Deny Rates</h1>
            <button
              onClick={handleExport}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Export to Excel
            </button>
          </div>
    
          <input
            type="text"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 text-sm dark:bg-black dark:text-gray-100"
            placeholder="Search by Farmer Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
    
          {loading ? (
            <div className="flex justify-center items-center">
              <Lottie animationData={loadingAnime} loop={true} className="w-24 h-24" />
            </div>
          ) : (
            <ReactDataTable
              columns={columns}
              data={filteredForm12s}
              progressPending={loading}
              pagination
              customStyles={customStyles}
              noDataComponent={<NoDataComponent />}
              responsive
            />
          )}
        </div>
      </div>
    );
    
  };

  export default ApproveDenyForm12;
