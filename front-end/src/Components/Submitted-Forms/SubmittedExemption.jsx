import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import Lottie from 'lottie-react';
import loadingAnime from '../../assets/lottie/loadingAnime.json';

const SubmittedExemption = () => {
  const [exemptions, setExemptions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:3000/api/exemptions/user/${userId}`)
        .then((response) => {
          const formattedData = response.data.map((exemption) => {
            const submitDate = exemption.createdAt
              ? new Date(exemption.createdAt).toLocaleDateString()
              : "-";

            const approvedDate =
              exemption.isApprovedbyTalati && exemption.isApprovedbyTalatiAt
                ? new Date(exemption.isApprovedbyTalatiAt).toLocaleDateString()
                : "-";

            const deniedDate =
              exemption.isDeniedbyTalati && exemption.isDeniedbyTalatiAt
                ? new Date(exemption.isDeniedbyTalatiAt).toLocaleDateString()
                : "-";

            let status = "Pending";
            if (exemption.isApprovedbyTalati) {
              status = "Approved";
            } else if (exemption.isDeniedbyTalati) {
              status = "Denied";
            }

            return {
              ...exemption,
              submitDate,
              approvedDate: status === "Approved" ? approvedDate : "-",
              deniedDate: status === "Denied" ? deniedDate : "-",
              status,
            };
          });

          setExemptions(formattedData);
        })
        .catch((err) => {
          setError("Error fetching exemption applications");
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );
  }
   
  if (!userId) return <div>Error: No user ID found in localStorage.</div>;
  if (error) return <div>{error}</div>;
  if (exemptions.length === 0) return <div>No exemption applications found.</div>;

  const getStatusColor = (status) => {
    if (status === "Pending") return "orange";
    if (status === "Denied") return "red";
    if (status === "Approved") return "green";
    return "black";
  };

  const columns = [
    {
      name: "Exemption ID",
      selector: (row) => row.exemption_id,
      sortable: true,
      wrap: true,
    },
    {
      name: "Is Own Well",
      selector: (row) => (row.isOwnWell ? "Yes" : "No"),
      sortable: true,
    },
    {
      name: "Date of Well",
      selector: (row) =>
        row.date_of_well ? new Date(row.date_of_well).toLocaleDateString() : "-",
      sortable: true,
    },
    {
      name: "Submit Date",
      selector: (row) => row.submitDate,
      sortable: true,
    },
    {
      name: "Approved Date",
      selector: (row) => row.approvedDate,
      sortable: true,
    },
    {
      name: "Denied Date",
      selector: (row) => row.deniedDate,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <span style={{ color: getStatusColor(row.status), fontWeight: "bold" }}>
          {row.status}
        </span>
      ),
      sortable: true,
    },
  ];

  return (
    <div className="p-4">
      <DataTable
        columns={columns}
        data={exemptions}
        pagination
        responsive
        highlightOnHover
        striped
      />
    </div>
  );
};

export default SubmittedExemption;
