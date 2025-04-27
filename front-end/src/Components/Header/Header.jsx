import { useState, useEffect, useRef } from "react";
import { HiChevronDown } from "react-icons/hi";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { NavLink } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Initialize AOS
    AOS.init();

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <header>
        <nav className="border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 bg-gray-100">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="/" className="flex items-center" rel="noopener noreferrer">
              <img
                src="/Logo/Logo.png"
                className="mr-3 h-24 w-24 sm:h-32 sm:w-32"
                alt="Kissan Plus Logo"
              />
            </a>
            <div className="flex items-center lg:order-2">
              {/* Dropdown Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800 flex items-center cursor-pointer"
                >
                  Get started
                  <HiChevronDown
                    className={`ml-2 transition-transform duration-700 ease-in-out ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu with AOS */}
                {isDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-48 z-50"
                    data-aos="fade-down"
                    data-aos-duration="300"
                  >
                    <ul className="shadow-box">
                      <li>
                        <a
                          href="sign-up"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaUserPlus className="mr-2 text-gray-500" />
                          Sign Up
                        </a>
                      </li>
                      <li>
                        <a
                          href="/login-page"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaSignInAlt className="mr-2 text-gray-500" />
                          Login
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                data-collapse-toggle="mobile-menu-2"
                type="button"
                className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="mobile-menu-2"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex lg:items-center lg:space-x-10">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-base font-medium ${isActive ? "text-green-500 font-semibold" : "text-gray-600"}`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/about-us"
                className={({ isActive }) =>
                  `text-base font-medium ${isActive ? "text-green-500 font-semibold" : "text-gray-600"}`
                }
              >
                About Us
              </NavLink>
              <NavLink
                to="/contact-us"
                className={({ isActive }) =>
                  `text-base font-medium ${isActive ? "text-green-500 font-semibold" : "text-gray-600"}`
                }
              >
                Contact Us
              </NavLink>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header;
