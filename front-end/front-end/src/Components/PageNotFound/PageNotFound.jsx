import  { useEffect } from "react";
import { NavLink } from "react-router"; // Ensure the correct import for your routing library
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS

function PageNotFound() {
  useEffect(() => {
    // Initialize AOS animations
    AOS.init({
      duration: 1000, // Duration for animation
      once: true,     // Animation triggers only once
    });

    // Refresh AOS on scroll to ensure animations are updated
    window.addEventListener('scroll', () => {
      AOS.refresh();
    });

    return () => {
      window.removeEventListener('scroll', () => {
        AOS.refresh();
      });
    };
  }, []);

  return (
    <div>
      <section className="bg-white dark:bg-gray-900" data-aos="fade-up">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1
              className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500"
              data-aos="fade-up"
            >
              404
            </h1>
            <p
              className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white"
              data-aos="fade-up"
            >
              Something is missing.
            </p>
            <p
              className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400"
              data-aos="fade-up"
            >
              Sorry, we cannot find that page. You will find lots to explore on
              the home page.{" "}
            </p>
            <div className="sm:col-span-2" data-aos="fade-up">
              <NavLink
                to="/"
                className="inline-flex items-center justify-center w-full px-4 py-4 mt-2 text-base font-semibold text-white transition-all duration-200 bg-green-600 border border-transparent rounded-md focus:outline-none hover:bg-green-400 focus:bg-green-500"
              >
                <i className="fas fa-arrow-left text-white mr-2"></i>
                Back to Home
              </NavLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PageNotFound;
