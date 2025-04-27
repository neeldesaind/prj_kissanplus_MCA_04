import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; // Import Hot Toast

const roles = ["Talati", "Engineer", "Chowkidar", "Karkoon"];

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    dob: "",
    gender: "",
    role: "",
    password: "",
  });

  const [passwordType, setPasswordType] = useState("automatic");
  const [loading, setLoading] = useState(false);

  const generatePassword = () => {
    if (!formData.role || !formData.dob) return "";
    const rolePart = formData.role.slice(0, 3);
    const [year, month, day] = formData.dob.split("-");
    return `${rolePart}@${day}${month}${year}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (passwordType === "automatic" && (e.target.name === "role" || e.target.name === "dob")) {
      setFormData((prev) => ({ ...prev, password: generatePassword() }));
    }
  };

  const handlePasswordTypeChange = (e) => {
    const newType = e.target.value;
    setPasswordType(newType);
    setFormData({ ...formData, password: newType === "automatic" ? generatePassword() : "" });
  };

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}/api/users/add-user`, formData);
      toast.success("User added successfully!"); // ✅ Success Toast
      setFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        dob: "",
        gender: "",
        role: "",
        password: "",
      });
    } catch (error) {
      toast.error("Failed to add user. Please try again.", error); // ❌ Error Toast
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New User</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block font-medium">Role</label>
        <select className="w-full p-2 border rounded" name="role" value={formData.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-medium">First Name</label>
            <input className="w-full p-2 border rounded" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label className="block font-medium">Middle Name</label>
            <input className="w-full p-2 border rounded" name="middleName" value={formData.middleName} onChange={handleChange} />
          </div>
          <div>
            <label className="block font-medium">Last Name</label>
            <input className="w-full p-2 border rounded" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>

        <label className="block font-medium">Email</label>
        <input className="w-full p-2 border rounded" name="email" type="email" value={formData.email} onChange={handleChange} required />

        <label className="block font-medium">Date of Birth</label>
        <input className="w-full p-2 border rounded" name="dob" type="date" value={formData.dob} onChange={handleChange} required />

        <label className="block font-medium">Password Type</label>
        <select className="w-full p-2 border rounded" name="passwordType" value={passwordType} onChange={handlePasswordTypeChange}>
          <option value="automatic">Automatic</option>
          <option value="manual">Manual</option>
        </select>

        <label className="block font-medium">Password</label>
        <input
          className={`w-full p-2 border rounded ${passwordType === "automatic" ? "bg-gray-100" : "bg-white"}`}
          name="password"
          type="text"
          value={formData.password}
          onChange={handleChange}
          readOnly={passwordType === "automatic"}
        />

        <label className="block font-medium">Gender</label>
        <select className="w-full p-2 border rounded" name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <button type="submit" className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600" disabled={loading}>
          {loading ? "Adding..." : "Add User"}
        </button>
      </form>
    </div>
  );
}
