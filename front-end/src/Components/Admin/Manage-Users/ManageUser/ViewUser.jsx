import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Lottie from "lottie-react";
import loadingAnime from "../../../../assets/lottie/loadingAnime.json";
import { useNavigate } from "react-router"; // Import useNavigate instead of useHistory
const BASE_URL = import.meta.env.VITE_BASE_URL;
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate here

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/users/view-user`);
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
      } catch (err) {
        setError("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users;

    if (selectedRole !== "All") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  }, [selectedRole, searchQuery, users]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handleViewProfile = (userId) => {
    navigate(`/side-bar/view-profile/${userId}`);
  };

  const handleExportToExcel = () => {
    const exportData = filteredUsers.map((user, index) => ({
      "#": index + 1,
      "Full Name": `${user.firstName} ${user.lastName}`,
      Phone: user.profile?.phone || "N/A",
      Role: user.role,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "users_list.xlsx");
  };

  const columns = [
    {
      name: "#",
      cell: (row, index) => index + 1,
      width: "60px",
      style: { textAlign: "center" },
    },
    {
      name: "Avatar",
      cell: (row) => (
        <img
          src={row.profile?.avatar || "/Default-Profile/profile-default.jpg"}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
      ),
      width: "80px",
      style: { textAlign: "center" },
    },
    {
      name: "Full Name",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.profile?.phone || "N/A",
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
      style: { textAlign: "center" },
    },
    {
      name: "Actions",
      cell: (row) => (
        <button
          onClick={() => handleViewProfile(row._id)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          View
        </button>
      ),
      style: { textAlign: "center" },
    },
  ];

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );

  if (error) return <p className="text-center text-red-500 text-xl">{error}</p>;

  return (
    <div className="container mx-auto p-4 max-w-5xl ml-75">
      {/* Table Header with Search and Role Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 bg-gray-50 p-4 rounded-md shadow-md border border-gray-300">
        <h2 className="text-2xl font-semibold text-black">User List</h2>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by full name..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border border-gray-300 px-3 py-2 rounded-md text-sm bg-white shadow-md w-64"
          />
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="border border-gray-300 px-3 py-2 rounded-md text-sm bg-white shadow-md"
          >
            <option value="All">All Roles</option>
            <option value="Farmer">Farmer</option>
            <option value="Talati">Talati</option>
            <option value="Karkoon">Karkoon</option>
            <option value="Engineer">Engineer</option>
            <option value="Chowkidar">Chowkidar</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button
          onClick={handleExportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
        >
          Export to Excel
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        highlightOnHover
        striped
        responsive
        progressPending={loading}
        className="shadow-lg border border-gray-300 rounded-lg"
        customStyles={{
          headRow: {
            style: {
              backgroundColor: "#E3F0AF",
              color: "black",
              fontWeight: "bold",
            },
          },
          rows: {
            style: {
              "&:nth-child(even)": {
                backgroundColor: "#fafcf0",
              },
              "&:hover": {
                backgroundColor: "#fafcf0",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default UsersList;
