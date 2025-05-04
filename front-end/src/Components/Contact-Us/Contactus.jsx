import { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS

function Contactus() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await axios.post(`${BASE_URL}/api/contact`, formData);
      setSuccessMessage(response.data.message);
      setFormData({ name: "", email: "", message: "" }); // Clear form after success
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Section: Your Image and Text */}
          <div
            className="relative flex items-end px-4 pb-16 pt-60 sm:pb-24 md:justify-center lg:pb-32 bg-gray-50 sm:px-6 lg:px-8"
            data-aos="fade-up"
          >
            <div className="absolute inset-0">
              <img
                className="object-cover w-full h-full"
                src="/Contact-Us/contact-support.jpg"
                alt="Contact Support"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
            <div className="relative">
              <div className="w-full max-w-xl xl:w-full xl:mx-auto xl:pr-24 xl:max-w-xl">
                <h3
                  className="text-4xl font-bold text-white"
                  data-aos="fade-up"
                >
                  Get in touch with us <br className="hidden xl:block" />
                  and we will help you
                </h3>
                <ul className="grid grid-cols-1 mt-10 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <li
                    className="flex items-center space-x-3"
                    data-aos="fade-up"
                  >
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-green-500 rounded-full">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      Quick Response
                    </span>
                  </li>
                  <li
                    className="flex items-center space-x-3"
                    data-aos="fade-up"
                  >
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-green-500 rounded-full">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      24/7 Availability
                    </span>
                  </li>
                  <li
                    className="flex items-center space-x-3"
                    data-aos="fade-up"
                  >
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-green-500 rounded-full">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      Expert Team
                    </span>
                  </li>
                  <li
                    className="flex items-center space-x-3"
                    data-aos="fade-up"
                  >
                    <div className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 bg-green-500 rounded-full">
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-lg font-medium text-white">
                      Easy Communication
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section: Contact Form */}
          <div
            className="flex items-center justify-center px-4 py-10 bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24"
            data-aos="fade-up"
          >
            <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
              <h2
                className="text-3xl font-bold leading-tight text-black sm:text-4xl"
                data-aos="fade-up"
              >
                Contact Us
              </h2>
              <p className="mt-2 text-base text-gray-600" data-aos="fade-up">
                Get in touch with us for support or any queries.
              </p>

              {/* Show success or error message */}
              {successMessage && (
                <p className="mt-4 text-green-600 font-semibold">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="mt-4 text-red-600 font-semibold">{errorMessage}</p>
              )}

              <form onSubmit={handleSubmit} className="mt-8">
                <div className="space-y-5">
                  <div>
                    <label className="text-base font-medium text-gray-900">Name</label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600" data-aos="fade-up">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="block w-full py-4 pl-4 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white caret-green-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-base font-medium text-gray-900">Email address</label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600" data-aos="fade-up">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email address"
                        required
                        className="block w-full py-4 pl-4 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white caret-green-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-base font-medium text-gray-900">Message</label>
                    <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600" data-aos="fade-up">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Enter your message"
                        required
                        className="block w-full py-4 pl-4 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:border-green-600 focus:bg-white caret-green-600"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 border border-transparent rounded-md bg-gradient-to-r from-green-900 to-green-600 focus:outline-none hover:opacity-80 focus:opacity-80 hover:scale-105 hover:bg-gradient-to-r hover:from-green-700 hover:to-green-500 cursor-pointer"
                      data-aos="fade-up"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contactus;
