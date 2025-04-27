import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Hero() {
  useEffect(() => {
    // Initialize AOS with settings
    AOS.init({ 
      duration: 1000, 
      easing: 'ease-out', 
      once: false, // Allow re-triggering of animations when scrolling up or down
    });

    // Optionally, refresh AOS on scroll (to handle scrolling up)
    const handleScroll = () => {
      AOS.refresh();
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <section className="bg-white dark:bg-gray-900 relative" data-aos="fade-up">
        {/* Background Image with Vignette Effect */}
        <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/Hero/main-slider-1.jpg')" }} loading="lazy">
          <div className="absolute inset-0 bg-black opacity-40 rounded-lg"></div>
        </div>
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 relative z-10">
          <div className="mr-auto place-self-center lg:col-span-7" data-aos="fade-up">
            <h1 className="max-w-2xl mb-6 text-4xl font-extrabold tracking-tight leading-tight md:text-5xl xl:text-6xl text-white hover:text-green-600 transition-colors duration-300">
              Kissan Plus – <br /> Empowering Farmers, <br /> Enhancing Agriculture
            </h1>

            <p className="max-w-2xl mb-6 font-light text-white lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              A smart solution for modern farming! Kissan Plus connects farmers with essential services, streamlines government processes, and ensures hassle-free management for officials. From land records to subsidy applications, everything is just a tap away. Grow more, manage better, and stay ahead with Kissan Plus!
            </p>

            <a
              href="/login-page"
              className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              Get started
              <svg
                className="w-5 h-5 ml-2 -mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>

            <a
              href="/contact-us"
              className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white border border-gray-300 rounded-lg hover:bg-black focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section className="py-10 bg-gray-100 sm:py-16 lg:py-24" data-aos="fade-up">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-y-8 lg:grid-cols-2 gap-x-16 xl:gap-x-24">
            <div className="relative mb-12 group">
              {/* Image with hover effect */}
              <img 
                className="w-full rounded-md transition-transform duration-300 group-hover:scale-105" 
                src="Hero/Section-2.jpg" 
                alt="" 
                loading="lazy"
                data-aos="fade-right"
              />

              <div className="absolute w-full max-w-xs px-4 -translate-x-1/2 sm:px-0 sm:max-w-sm left-1/2 -bottom-12">
                <div className="overflow-hidden bg-white rounded">
                  <div className="px-10 py-6">
                    <div className="flex items-center">
                      <p className="flex-shrink-0 text-3xl font-bold text-blue-600 sm:text-4xl">97%</p>
                      <p className="pl-6 text-sm font-medium text-black sm:text-lg">Of farmers use <br />our system</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full" data-aos="fade-left">
                <svg className="w-8 h-8 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="mt-10 text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-2xl lg:leading-tight" data-aos="fade-up">Your trusted partner in streamlining agricultural and administrative processes!</h2>
              <p className="mt-6 mb-5 text-lg leading-relaxed text-gray-600" data-aos="fade-up">Our platform is designed to empower farmers and administrative personnel, ensuring efficiency, transparency, and ease of use in every interaction.</p>

              <a 
                href="/about-us" 
                title="" 
                className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 rounded-lg text-center me-2 mb-2" 
                role="button" 
                data-aos="fade-up"
              >
                Explore more
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
