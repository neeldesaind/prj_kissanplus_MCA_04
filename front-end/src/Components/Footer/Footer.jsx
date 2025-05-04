import { useEffect, useState } from "react";
import { useLocation } from "react-router";

function Footer() {
  const location = useLocation();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  return (
    <div>
      <section className="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
              <img className="w-auto h-32" src="/Logo/Logo.png" alt="" />
              <h1 className="text-2xl font-bold">Kissan Plus</h1>
              <p className="text-base leading-relaxed text-gray-600 mt-4">
                Your trusted partner in streamlining <br />
                agricultural and administrative processes!
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                Company
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  { name: "Home", path: "/" },
                  { name: "About Us", path: "/about-us" },
                  { name: "Contact", path: "/contact-us" },
                ].map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      className={`flex text-base transition-all duration-200 hover:text-green-600 focus:text-green-600 ${
    active === item.path ? "text-green-600 font-bold" : "text-black"
  }`}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                Policies
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  { name: "Terms & Conditions", path: "/terms-and-condition" },
                  { name: "Privacy Policy", path: "/privacy-policy" },
                ].map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      className={`flex text-base transition-all duration-200 hover:text-green-600 focus:text-green-600 ${
    active === item.path ? "text-green-600 font-bold" : "text-black"
  }`}
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

           
          </div>

          <hr className="mt-16 mb-10 border-gray-200" />

          <p className="text-sm text-center text-gray-600">
            © Copyright 2025, All Rights Reserved by Kissan Plus - Made with ❤️
          </p>
        </div>
      </section>
    </div>
  );
}

export default Footer;