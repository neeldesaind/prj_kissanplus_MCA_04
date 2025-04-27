import { useEffect } from "react";
import { NavLink } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";

function AboutUs() {
  useEffect(() => {
    // Initialize AOS with options
    AOS.init({
      duration: 1000,
      easing: "ease-out",
      once: false, // Allow re-triggering of animations on both scroll down and scroll up
    });

    // Refresh AOS on scroll to ensure animations work on scroll up
    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Page Header Section */}
      <section className="page-header relative" data-aos="fade-up">
        <div
          className="page-header-bg bg-cover bg-center h-96"
          style={{
            backgroundImage: "url(/About-Us/About-us-Header-bg.jpg)", // Add your image URL here
          }}
        ></div>
        <div className="container mx-auto px-4 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-center">
          <div className="page-header__inner text-center flex flex-col justify-center items-center">
            <ul className="thm-breadcrumb list-unstyled text-white flex items-center justify-center">
              <li>
                <a href="/" className="text-white ">
                  Home
                </a>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-white">About</li>
            </ul>
            <h2 className="text-4xl font-bold text-white">About us</h2>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section
        className="py-12"
        style={{
          backgroundImage: "url('/path-to-your-image.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-aos="fade-up"
      >
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="w-full justify-center items-center xl:gap-12 gap-10 grid lg:grid-cols-2 grid-cols-1">
            <div className="w-full flex-col justify-center lg:items-start items-center gap-10 inline-flex">
              <div className="w-full flex-col justify-center items-start gap-8 flex">
                <div className="flex-col justify-start lg:items-start items-center gap-4 flex">
                  <div className="w-full flex-col justify-start lg:items-start items-center gap-3 flex">
                    <h2
                      className="text-green-700 text-4xl font-bold font-manrope leading-normal lg:text-start text-center hover:text-green-500 transition duration-300"
                      data-aos="fade-up"
                    >
                      Get to Know Kissan Plus!
                    </h2>

                    <p
                      className="text-gray-500 text-base font-normal leading-relaxed lg:text-start text-center"
                      data-aos="fade-up"
                    >
                      Your trusted partner in streamlining agricultural and administrative processes! Our platform is designed to empower farmers and administrative personnel, ensuring efficiency, transparency, and ease of use in every interaction.
                      <br />
                      With a focus on providing tailored solutions, our system bridges the gap between farmers and local government offices, enabling seamless communication and hassle-free operations.
                    </p>
                  </div>
                </div>
                <div className="w-full flex-col justify-center items-start gap-6 flex">
                  <div className="w-full justify-center items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                    <div
                      className="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex"
                      data-aos="fade-up"
                    >
                      <h4 className="text-gray-900 text-2xl font-bold font-manrope leading-9">
                        500+ Farmers
                      </h4>
                      <p className="text-gray-500 text-base font-normal leading-relaxed">
                        Empowering Farmers with Technology and Knowledge
                      </p>
                    </div>
                    <div
                      className="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex"
                      data-aos="fade-up"
                    >
                      <h4 className="text-gray-900 text-2xl font-bold font-manrope leading-9">
                        125+ Successful Harvests
                      </h4>
                      <p className="text-gray-500 text-base font-normal leading-relaxed">
                        Helping Farmers Achieve Better Yields with Smart Practices
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-full justify-center items-center gap-8 grid md:grid-cols-2 grid-cols-1">
                    <div
                      className="w-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex"
                      data-aos="fade-up"
                    >
                      <h4 className="text-gray-900 text-2xl font-bold font-manrope leading-9">
                        26+ Awards
                      </h4>
                      <p className="text-gray-500 text-base font-normal leading-relaxed">
                        Recognized for Excellence in Sustainable Farming Practices
                      </p>
                    </div>
                    <div
                      className="w-full h-full p-3.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all duration-700 ease-in-out flex-col justify-start items-start gap-2.5 inline-flex"
                      data-aos="fade-up"
                    >
                      <h4 className="text-gray-900 text-2xl font-bold font-manrope leading-9">
                        99% Happy Farmers
                      </h4>
                      <p className="text-gray-500 text-base font-normal leading-relaxed">
                        Our Commitment to Farmer Welfare and Satisfaction
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <NavLink
                to="/login-page"
                className="sm:w-fit w-full group px-3.5 py-2 bg-green-600 hover:bg-green-500 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] transition-all duration-700 ease-in-out justify-center items-center flex"
                data-aos="fade-up"
              >
                <span className="px-1.5 text-white text-sm font-medium leading-6 group-hover:-translate-x-0.5 transition-all duration-700 ease-in-out">
                  Get Started
                </span>
                <svg
                  className="group-hover:translate-x-0.5 transition-all duration-700 ease-in-out"
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M6.75265 4.49658L11.2528 8.99677L6.75 13.4996"
                    stroke="#ffffff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </NavLink>
            </div>
            <div className="w-full lg:justify-start justify-center items-start flex">
              <div className="sm:w-[400px] w-full sm:h-[400px] h-full sm:bg-gray-100 rounded-3xl sm:border border-gray-200 relative">
                <img
                  className="sm:mt-5 sm:ml-5 w-full h-full rounded-3xl object-cover"
                  src="/About-Us/About-us-farmer.jpg"
                  alt="about Us image"
                  data-aos="fade-left"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
