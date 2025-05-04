import { useState } from "react";
import { useDarkMode } from "../Context/useDarkMode"; // ✅ Make sure the path is correct
import Lottie from "lottie-react";
import loadingAnime from "../../assets/lottie/loadingAnime.json"; // ✅ Make sure the path is correct

const ThemeSettings = () => {
  const { theme, setTheme } = useDarkMode();
  const [loading] = useState(false); // ✅ Add loading state

  const themes = [
    {
      id: "light",
      label: "Light",
      bgColor: "bg-white",
      textColor: "text-black",
      borderColor: "border-gray-300",
      insetBg: "bg-gray-100",
      insetText: "text-black",
    },
    {
      id: "dark",
      label: "Dark",
      bgColor: "bg-gray-700",
      textColor: "text-white",
      borderColor: "border-gray-600",
      insetBg: "bg-black",
      insetText: "text-white",
    },
    {
      id: "system",
      label: "System",
      bgColor: "bg-white",
      textColor: "text-black",
      borderColor: "border-black",
      insetBg: "bg-gray-700",
      insetText: "text-white",
    },
  ];

  

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1b1c1c] dark:text-white">
      <div className="relative p-10 w-[500px] bg-white rounded-2xl shadow-2xl dark:bg-black dark:text-white">
        {/* ✅ Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center rounded-2xl">
            <Lottie animationData={loadingAnime} loop={true} className="w-24 h-24" />
          </div>
        )}

        <h2 className="text-3xl font-bold text-center mb-8 dark:bg-black dark:text-white">Theme Settings</h2>

        <div>
          <p className="text-gray-600 mb-4 text-center text-lg dark:bg-black dark:text-white">Appearance</p>
          <div className="flex gap-5 justify-center">
            {themes.map((t) => (
              <button
                key={t.id}
                className={`relative flex-1 p-6 rounded-xl border flex flex-col items-center justify-center h-32 
                  ${theme === t.id ? "border-black" : t.borderColor} 
                  ${t.bgColor} transition duration-200`}
                onClick={() => setTheme(t.id)}
                disabled={loading} // ⛔ Prevent interaction during loading
              >
                {/* Inset Smaller Card */}
                <div className={`absolute inset-4 rounded-lg ${t.insetBg} flex items-center justify-center`}>
                  <p className={`text-xl font-bold ${t.insetText}`}>Aa</p>
                </div>

                {/* System Theme Split Effect */}
                {t.id === "system" && (
                  <div className="absolute inset-y-4 right-4 w-1/3 bg-white rounded-lg flex items-center justify-center">
                    <p className="text-black text-xl font-bold">Aa</p>
                  </div>
                )}

                {/* Checkmark for Selected Theme */}
                {theme === t.id && (
                  <span className="absolute bottom-4 right-4 bg-black text-white text-lg rounded-full w-7 h-7 flex items-center justify-center">
                    ✔
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThemeSettings;
