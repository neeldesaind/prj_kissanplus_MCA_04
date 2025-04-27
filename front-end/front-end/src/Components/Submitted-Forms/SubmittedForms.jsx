import { useState, useEffect } from "react";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import SubmittedNoc from "./SubmittedNoc";
import SubmittedExemption from "./SubmittedExemption";
import SubmittedNamuna7 from "./SubmittedNamuna7";
import Lottie from 'lottie-react';
import loadingAnime from '../../assets/lottie/loadingAnime.json';

function SubmittedForms() {
  const [filter, setFilter] = useState("Noc");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    if (userIdFromStorage) {
      setUserId(userIdFromStorage);
    } else {
      console.error("No userId found in localStorage");
    }
  }, []);

  if (!userId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie animationData={loadingAnime} className="w-40 h-40" />
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-center mt-5 ml-50 dark:bg-[#1b1c1c] dark:text-white">
      <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-5xl relative dark:bg-black dark:text-white">
        {/* Filter Dropdown */}
        <div className="absolute right-4 top-4">
          <select
            className="border rounded p-1 dark:bg-[#1b1c1c] dark:text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="Noc">Noc</option>
            <option value="Namuna 7">Namuna 7</option>
            <option value="Exemption">Exemption</option>
          </select>
        </div>

        <div className="flex items-center mb-4">
          <HiOutlineBadgeCheck className="w-6 h-6 mr-2 text-green-500" />
          <h2 className="text-xl font-bold">Submitted Forms</h2>
        </div>

        {/* Render selected form */}
        {filter === "Noc" && <SubmittedNoc />}
        {filter === "Namuna 7" && <SubmittedNamuna7 />}
        {filter === "Exemption" && <SubmittedExemption userId={userId} />}
      </div>
    </div>
  );
}

export default SubmittedForms;
