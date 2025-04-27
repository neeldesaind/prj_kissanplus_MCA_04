import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const FarmApplication = () => {
  const storedUserId = localStorage.getItem("userId");

  const [waterSource, setWaterSource] = useState("ownWell");
  const [isChecked, setIsChecked] = useState(false);
  const [farmDetails, setFarmDetails] = useState([]);
  const [othersSurveyNumber, setOthersSurveyNumber] = useState("");
  const [wellEstablishedYear, setWellEstablishedYear] = useState("2025");

  const [userData, setUserData] = useState({
    farmerName: "",
    village: "",
    subDistrict: "",
    district: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/users/profile/${storedUserId}`
        );
        const data = res.data;

        let districtList = [],
          subDistrictList = [],
          villageList = [];

        try {
          const [districtsRes, subDistrictsRes, villagesRes] =
            await Promise.all([
              axios.get(`${BASE_URL}/api/districts/state/${data.state_id}`),
              axios.get(
                `${BASE_URL}/api/subdistricts/district/${data.district_id}`
              ),
              axios.get(
                `${BASE_URL}/api/villages/subdistrict/${data.subdistrict_id}`
              ),
            ]);

          districtList = districtsRes.data.districts || [];
          subDistrictList = subDistrictsRes.data.subdistricts || [];
          villageList = villagesRes.data || [];
        } catch (locationErr) {
          console.error("Failed to fetch location data:", locationErr);
          toast.error("Complete your profile and farm with location data.");
        }

        const district = districtList.find((d) => d._id === data.district_id);
        const subDistrict = subDistrictList.find(
          (s) => s._id === data.subdistrict_id
        );
        const village = villageList.find((v) => v._id === data.village_id);

        setUserData({
          farmerName: `${data.firstName || ""} ${data.middleName || ""} ${
            data.lastName || ""
          }`.trim(),
          district: district?.district_name || data.district_id,
          subDistrict: subDistrict?.subdistrict_name || data.subdistrict_id,
          village: village?.village_name || data.village_id,
        });

        // Fetch Farm Details
        try {
          const farmRes = await axios.get(
            `${BASE_URL}/api/farms/getfarm?userId=${storedUserId}`
          );
          const farmArray = Array.isArray(farmRes.data)
            ? farmRes.data
            : farmRes.data.farms || [];

          if (!farmArray.length) {
            toast.error("No farms found. Please add farms in your profile.");
            return;
          }

          const farmsWithVillageNames = await Promise.all(
            farmArray.map(async (farm) => {
              try {
                const villageRes = await axios.get(
                  `${BASE_URL}/api/villages/${farm.village_id}`
                );
                return {
                  ...farm,
                  village_name: villageRes.data.village_name || "",
                };
              } catch (err) {
                console.warn(
                  `Failed to fetch village for farm with ID ${farm._id} and village_id ${farm.village_id},error:`,
                  err
                );
                return {
                  ...farm,
                  village_name: "", // fallback to empty
                };
              }
            })
          );

          setFarmDetails(farmsWithVillageNames);
        } catch (farmErr) {
          console.error("Farm fetch error:", farmErr);
          toast.error("Add Farm data in farm");
        }
      } catch (profileErr) {
        console.error("Profile fetch error:", profileErr);
        toast.error("Failed to load user profile.");
      }
    };

    if (storedUserId && BASE_URL) {
      fetchUserData();
    }
  }, []);

  const handleSubmit = async () => {
    toast.dismiss();

    // Ensure farmDetails is defined and mapped correctly
    const farmDetailsMapped = farmDetails.map((farm) => ({
      village_name: farm.village_name,
      surveyNumber: farm.surveyNumber,
      poatNumber: farm.poatNumber,
      farmArea: farm.farmArea,
    }));

    const data = {
      userId: storedUserId,
      waterSource,
      othersSurveyNumber:
        waterSource === "othersWell" ? othersSurveyNumber : null,
      farmDetails: farmDetailsMapped,
      isOwner: isChecked,
      date_of_well: wellEstablishedYear
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/exemptions/submit-exemption`,
        data
      );
      toast.success(
        response.data.message || "Exemption application submitted successfully!"
      );
    } catch (error) {
      console.error("Submission error:", error);

      if (error.response) {
        const { status, data } = error.response;

        if (status === 400 && data.message.includes("within the last month")) {
          toast.error(
            "You have already submitted an application this month. Try again after one month."
          );
        } else if (
          status === 404 &&
          data.message.includes("User profile not found")
        ) {
          toast.error("User profile not found. Please log in again.");
        } else {
          toast.error(data.message || "Failed to submit the application.");
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  const handleDeleteFarm = (indexToDelete) => {
    if (farmDetails.length <= 1) {
      toast.error("At least one farm detail must be present.");
      return;
    }

    const updatedFarms = farmDetails.filter(
      (_, index) => index !== indexToDelete
    );
    setFarmDetails(updatedFarms);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 ml-80">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-xl font-bold text-center mb-2">Application</h1>
        <h1 className="text-md font-medium text-center mb-4">
          Application for having own well
        </h1>

        {/* Declaration Section */}
        <div className="mb-4 p-6 rounded-md bg-gray-50">
          <h2 className="text-md font-semibold mb-2">Declaration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="inline-flex items-center gap-2 w-full">
              <span>I</span>
              <input
                type="text"
                className="border-b border-gray-500 bg-transparent p-1 flex-1 focus:outline-none"
                value={userData.farmerName}
                disabled
              />
            </div>

            <div className="inline-flex items-center gap-2 w-full">
              <span>Resident Of</span>
              <input
                type="text"
                className="border-b border-gray-500 bg-transparent p-1 flex-1 focus:outline-none"
                value={userData.village}
                disabled
              />
            </div>

            <div className="inline-flex items-center gap-2 w-full">
              <span>Sub-District</span>
              <input
                type="text"
                className="border-b border-gray-500 bg-transparent p-1 flex-1 focus:outline-none"
                value={userData.subDistrict}
                disabled
              />
            </div>

            <div className="inline-flex items-center gap-2 w-full">
              <span>District</span>
              <input
                type="text"
                className="border-b border-gray-500 bg-transparent p-1 flex-1 focus:outline-none"
                value={userData.district}
                disabled
              />
            </div>
          </div>
          <div className="mt-3">
            <p className="mb-2 text-sm">
              Therefore, I request that the supply of canal water not be
              provided to my farm, as I already have an adequate water source
              through:
            </p>
            <div className="flex gap-4 items-center">
              <select
                className="border-b border-gray-500 bg-transparent p-1 focus:outline-none"
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
              >
                <option value="ownWell">Own Well</option>
                <option value="othersWell">Others Well</option>
              </select>

              {waterSource === "othersWell" && (
                <input
                  type="text"
                  className="border-b border-gray-500 bg-transparent p-1 w-32 focus:outline-none"
                  placeholder="Survey Number"
                  value={othersSurveyNumber}
                  onChange={(e) => setOthersSurveyNumber(e.target.value)}
                />
              )}

              <span>Since</span>

              <select
                className="border-b border-gray-500 bg-transparent p-1 focus:outline-none"
                value={wellEstablishedYear}
                onChange={(e) => setWellEstablishedYear(e.target.value)}
              >
                {[2025, 2024, 2023, 2022, 2021, 2020].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <span>the well is established.</span>
            </div>
          </div>
        </div>

        <hr className="border-y-green-500" />

        {/* Farm Details Section */}
        <div className="mb-4 p-6 rounded-md bg-gray-50 shadow-lg">
          <h2 className="text-md font-semibold mb-2">Farm Details</h2>
          <p className="text-sm text-gray-500 mb-3">
            Please fill in the farm details below.
          </p>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse text-sm px-2">
              <thead>
                <tr className="text-left">
                  <th className="text-center">Village Name</th>
                  <th className="text-center">Survey Number</th>
                  <th className="text-center">Poat Number</th>
                  <th className="text-center">Total Area</th>
                  {farmDetails.length > 1 && (
                    <th className="text-center">Actions</th>
                  )}
                </tr>
                <tr className="bg-gray-100">
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {farmDetails.map((farm, index) => (
                  <tr key={index}>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={farm.village_name || ""}
                        readOnly
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={farm.surveyNumber || ""}
                        readOnly
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={farm.poatNumber || ""}
                        readOnly
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        className="border p-2 rounded w-full"
                        value={farm.farmArea || ""}
                        readOnly
                      />
                    </td>

                    {farmDetails.length > 1 && (
                      <td className="p-2">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded"
                          onClick={() => handleDeleteFarm(index)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                    <td className="p-2"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <hr className="border-y-green-500" />

        {/* Declaration Checkbox */}
        <p className="mb-3 mt-4 flex items-center text-xs leading-relaxed">
          <input
            type="checkbox"
            id="ownerDeclarationCheckbox"
            className="mr-3 scale-150 accent-green-600"
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <label htmlFor="ownerDeclarationCheckbox" className="inline-block">
            I am the
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1 mx-2 w-20 text-xs bg-gray-100"
              placeholder="Owner"
              id="applicantNameInput"
              disabled
            />
            of the above-mentioned farm. I hereby declare that the information
            provided above is true to the best of my knowledge and belief. I am
            responsible for any discrepancies found in the information provided
            above.
          </label>
        </p>
        {/* Submit Button */}
        <div className="text-center">
          <button
            className={`px-4 py-2 rounded ${
              isChecked
                ? "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
                : "bg-gray-200 text-gray-700 cursor-not-allowed"
            }`}
            disabled={!isChecked}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmApplication;
