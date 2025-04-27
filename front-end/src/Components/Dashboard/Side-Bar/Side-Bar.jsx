import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import PropTypes from "prop-types";
import { Toaster, toast } from "react-hot-toast";
import { useLocation } from "react-router";
import { RiDashboard2Fill } from "react-icons/ri";
import { MdPayment, MdOutlinePassword } from "react-icons/md";
import { FaWpforms, FaAffiliatetheme, FaInfo } from "react-icons/fa";
import { Bs7CircleFill } from "react-icons/bs";
import { CiNoWaitingSign, CiSettings } from "react-icons/ci";
import { TbNumber12Small } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import { CiLogin } from "react-icons/ci";
import { GiHamburgerMenu, GiWell } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { GiFarmTractor } from "react-icons/gi";
import { CiLocationArrow1 } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useNavigate } from "react-router";
import { FaUsers } from "react-icons/fa6";
import { RiUserSearchLine } from "react-icons/ri";
import { MdPublic } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import { GiMapleLeaf } from "react-icons/gi";
import { GiVillage } from "react-icons/gi";
import { GiWaterfall } from "react-icons/gi";
import { useMemo } from "react";
import { FaHandPointRight } from "react-icons/fa";
import { PiNumberCircleSevenBold } from "react-icons/pi"


// PropType declaration for user role
SideBar.propTypes = {
  userRole: PropTypes.oneOf([
    "farmer",
    "talati",
    "karkoon",
    "engineer",
    "admin",
    "chowkidar",
  ]).isRequired,
};

// Routes based on roles
const roleBasedRoutes = {
  common: [
    {
      path: "/side-bar/dashboard",
      label: "Dashboard",
      icon: <RiDashboard2Fill />,
    },
    {
      label: "Settings",
      key: "common-settings",
      icon: <CiSettings />,
      subLinks: [
        {
          path: "/side-bar/personal-profile",
          label: "Personal Profile",
          icon: <CgProfile />,
        },
        {
          path: "/side-bar/theme-settings",
          label: "Theme Settings",
          icon: <FaAffiliatetheme />,
        },
        {
          path: "/side-bar/change-password",
          label: "Change Password",
          icon: <MdOutlinePassword />,
        },
      ],
    },
  ],

  chowkidar: [
    {
      path: "/side-bar/view-form12",  // Example route for "chowkidar"
      label: "Requests",
      icon: <FaInfo />,
    },
  ],
  farmer: [
    { path: "/side-bar/payments", label: "Payments", icon: <MdPayment /> },
    { path: "/side-bar/submitted-forms", label: "Submitted Forms", icon: <FaHandPointRight  /> },
    {
      label: "Forms",
      key: "farmer-forms",
      icon: <FaWpforms />,
      subLinks: [
        {
          path: "/side-bar/namuna-7",
          label: "Namuna 7",
          icon: <Bs7CircleFill />,
        },
        {
          path: "/side-bar/noc",
          label: "Apply NOC",
          icon: <CiNoWaitingSign />,
        },
        {
          path: "/side-bar/application",
          label: "Application for Own Well",
          icon: <GiWell />,
        },
      ],
    },
    {
      label: "Settings",
      key: "merged-settings",
      icon: <CiSettings />,
      subLinks: [
        {
          path: "/side-bar/personal-profile",
          label: "Personal Profile",
          icon: <CgProfile />,
        },
        {
          path: "/side-bar/theme-settings",
          label: "Theme Settings",
          icon: <FaAffiliatetheme />,
        },
        {
          path: "/side-bar/change-password",
          label: "Change Password",
          icon: <MdOutlinePassword />,
        },
        {
          path: "/side-bar/farm-profile",
          label: "Farm Profile",
          icon: <GiFarmTractor />,
        },
      ],
    },
  ],
  talati: [
    {
      label: "Requests",
      key: "talati-requests",
      icon: <FaInfo />,
      subLinks: [
        {
          path: "/side-bar/view-namuna",
          label: "Namuna 7",
          icon: <Bs7CircleFill />,
        },
        {
          path: "/side-bar/approve-deny-noc",
          label: "NOC",
          icon: <CiNoWaitingSign />,
        },
        {
          path: "/side-bar/approve-deny-exemption",
          label: "Water Exemption",
          icon: <GiWell />,
        },
      ],
    },
    {
      label: "View Payments",
      key: "talati-view-payments",
      icon: <MdPayment />,  // Suitable icon for Namuna 7
      path: "/side-bar/all-payments",  // Direct path to the Namuna 7 page
    },
  ],
  
  karkoon: [
    {
      label: "Forms",
      key: "karkoon-forms",
      icon: <FaWpforms />,
      subLinks: [
        {
          path: "/side-bar/form12",
          label: "Form 12",
          icon: <TbNumber12Small />,
        },
      ],
    },
  ],

  engineer: [
    {
      path: "/side-bar/approve-deny-form12",  // Example route for "chowkidar"
      label: "Requests",
      icon: <FaInfo />,
    },
  ],
 
  admin: [
    {
      label: "Manage Users",
      key: "admin-manage-users",
      icon: <FaUsers />,
      subLinks: [
        {
          path: "/side-bar/adduser",
          label: "Add Users",
          icon: <FaUserPlus />,
        },
        {
          path: "/side-bar/view-users",
          label: "View Users",
          icon: <RiUserSearchLine />,
        },
        
      ],
    },
    {
      label: "Manage Locations",
      key: "admin-manage-locations",
      icon: <CiLocationArrow1 />,
      subLinks: [
        {
          path: "/side-bar/add-state",
          label: "State",
          icon: <MdPublic />,
        },
        {
          path: "/side-bar/add-district",
          label: "District",
          icon: <FaMapMarkedAlt />,
        },
        {
          path: "/side-bar/add-sub-district",
          label: "Sub-District",
          icon: <GiMapleLeaf />,
        },
        {
          path: "/side-bar/add-village",
          label: "Village",
          icon: <GiVillage />,
        },
        {
          path: "/side-bar/add-canal",
          label: "Canal",
          icon: <GiWaterfall />,
        },
      ],
    },
    {
      label: "Manage Namuna 7",
      key: "admin-manage-namuna7",
      icon: <PiNumberCircleSevenBold />,  // Suitable icon for Namuna 7
      path: "/side-bar/manage-namuna",  // Direct path to the Namuna 7 page
    },
    {
      label: "View Payments",
      key: "admin-view-payments",
      icon: <MdPayment />,  // Suitable icon for Namuna 7
      path: "/side-bar/all-payments",  // Direct path to the Namuna 7 page
    },
  ],
};

// Sidebar Component
function SideBar({ userRole }) {
  const navigate = useNavigate();
  const role = userRole || "";
  useEffect(() => {
    if (!role || !roleBasedRoutes[role]) {
      navigate("/login-page", { replace: true });
    }
  }, [role, navigate]);

  const filteredCommonRoutes =
    role === "farmer"
      ? roleBasedRoutes.common.filter((link) => link.label !== "Settings")
      : roleBasedRoutes.common;

  const links = useMemo(() => {
    return [
      ...filteredCommonRoutes,
      ...(roleBasedRoutes[role] || []), // Accessing only the specific role's routes
      { path: "/login-page", label: "Logout", icon: <CiLogin />, logout: true },
    ];
  }, [role, filteredCommonRoutes]); // Removed roleBasedRoutes if it’s static
  

  if (role === "admin") {
    const settingsIndex = links.findIndex((link) => link.label === "Settings");
    if (settingsIndex !== -1) {
      const settings = links.splice(settingsIndex, 1)[0]; // Remove "Settings"

      // Find index of "Logout" and insert "Settings" before it
      const logoutIndex = links.findIndex((link) => link.label === "Logout");
      links.splice(logoutIndex, 0, settings);
    }
  }

  if (role === "talati") {
    const settingsIndex = links.findIndex((link) => link.label === "Settings");
    if (settingsIndex !== -1) {
      const settings = links.splice(settingsIndex, 1)[0]; // Remove "Settings"

      // Find index of "Logout" and insert "Settings" before it
      const logoutIndex = links.findIndex((link) => link.label === "Logout");
      links.splice(logoutIndex, 0, settings);
    }
  }

  if (role === "karkoon") {
    const settingsIndex = links.findIndex((link) => link.label === "Settings");
    if (settingsIndex !== -1) {
      const settings = links.splice(settingsIndex, 1)[0]; // Remove "Settings"

      // Find index of "Logout" and insert "Settings" before it
      const logoutIndex = links.findIndex((link) => link.label === "Logout");
      links.splice(logoutIndex, 0, settings);
    }
  }
  if (role === "chowkidar") {
    const settingsIndex = links.findIndex((link) => link.label === "Settings");
    if (settingsIndex !== -1) {
      const settings = links.splice(settingsIndex, 1)[0]; // Remove "Settings"

      // Find index of "Logout" and insert "Settings" before it
      const logoutIndex = links.findIndex((link) => link.label === "Logout");
      links.splice(logoutIndex, 0, settings);
    }
  }
  if (role === "engineer") {
    const settingsIndex = links.findIndex((link) => link.label === "Settings");
    if (settingsIndex !== -1) {
      const settings = links.splice(settingsIndex, 1)[0]; // Remove "Settings"

      // Find index of "Logout" and insert "Settings" before it
      const logoutIndex = links.findIndex((link) => link.label === "Logout");
      links.splice(logoutIndex, 0, settings);
    }
  }
  
  const handleLogout = (e) => {
    e.preventDefault();

    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login-page", { replace: false });
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, "", window.location.href);
      };
      window.location.reload();
    }
  };

  const [isOpen, setIsOpen] = useState(true);
  const [dropdownStates, setDropdownStates] = useState({});

  const firstName = localStorage.getItem("firstName") || "User";
  const lastName = localStorage.getItem("lastName") || "";

  const toggleDropdown = (label) => {
    setDropdownStates((prevState) => {
      // Close all dropdowns except the one that was clicked
      const updatedState = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === label ? !prevState[key] : false; // Toggle the selected dropdown and close others
        return acc;
      }, {});
      return updatedState;
    });
  };

  const location = useLocation();

  useEffect(() => {
    const { firstName, lastName } = location.state || {};

    if (firstName && lastName) {
      toast.success(`Welcome, ${firstName} ${lastName}!`, { duration: 3000 });
    }
  }, [location]);

  useEffect(() => {
    setDropdownStates((prevState) => {
      const updatedDropdownStates = { ...prevState };

      links.forEach((item) => {
        if (item.subLinks) {
          const isActive = item.subLinks.some(
            (sub) => location.pathname === sub.path
          );

          // If the link is active (current tab), keep it open, else close it
          updatedDropdownStates[item.label] = isActive ? true : false;
        }
      });

      return updatedDropdownStates;
    });
  }, [location.pathname]); // Only listen to pathname changes

  return (
    <div className="flex">
      <Toaster position="top-center" reverseOrder={false} />
      <aside
        className={`fixed top-0 left-0 h-screen bg-[#FBF6E9] transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        } z-50`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex justify-between items-center px-4 py-3">
            <img
              src="/Logo/Logo.png"
              className={`h-25 transition-all ${isOpen ? "block" : "hidden"}`}
              alt="Kissan Plus Logo"
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-900 cursor-pointer dark:text-white"
            >
              {isOpen ? <IoClose size={24} /> : <GiHamburgerMenu size={24} />}
            </button>
          </div>

          {/* Welcome Message */}
          {isOpen && (
            <div className="p-4 text-green-700 text-lg font-bold">
              Welcome, {firstName} {lastName}!
            </div>
          )}

          {/* Navigation Links */}
          <ul className="flex-1 mt-3 space-y-2">
            {links.map((item) =>
              item.subLinks ? (
                <li key={item.label}>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`flex items-center w-full p-2 rounded-lg cursor-pointer ${
                      isOpen ? "justify-between" : "justify-center"
                    }`}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      {isOpen && <span className="ml-3">{item.label}</span>}
                    </div>
                    {isOpen && (
                      <span>
                        {dropdownStates[item.label] ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </span>
                    )}
                  </button>
                  {dropdownStates[item.label] && isOpen && (
                    <ul className="ml-6 mt-2 space-y-2">
                      {item.subLinks.map((sub) => (
                        <li key={sub.path}>
                          <NavLink
                            to={sub.path}
                            className={({ isActive }) =>
                              `flex items-center p-2 rounded-lg ${
                                isActive
                                  ? "bg-[#E3F0AF] text-[#118B50]"
                                  : "hover:bg-[#E3F0AF]"
                              } ${isOpen ? "justify-start" : "justify-center"}`
                            }
                          >
                            {sub.icon}
                            {isOpen && (
                              <span className="ml-3">{sub.label}</span>
                            )}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ) : (
                <li key={item.path}>
                  {item.logout ? (
                    <button
                      onClick={handleLogout}
                      className={`flex items-center w-full p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 ${
                        isOpen ? "justify-start" : "justify-center"
                      }`}
                    >
                      {item.icon}
                      {isOpen && <span className="ml-3">{item.label}</span>}
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center p-2 rounded-lg ${
                          isActive
                            ? "bg-[#E3F0AF] text-[#118B50]"
                            : "hover:bg-[#E3F0AF]"
                        } ${isOpen ? "justify-start" : "justify-center"}`
                      }
                    >
                      {item.icon}
                      {isOpen && <span className="ml-3">{item.label}</span>}
                    </NavLink>
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default SideBar;
