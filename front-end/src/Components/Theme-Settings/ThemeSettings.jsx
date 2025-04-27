import { useState } from "react";
import Lottie from "lottie-react";
import loadingAnime from "../../assets/lottie/loadingAnime.json"; // ✅ Make sure the path is correct

const ThemeSettings = () => {
  const [selectedTheme, setSelectedTheme] = useState("system");
  const [loading, setLoading] = useState(false); // ✅ Add loading state

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

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      alert(`Theme set to ${selectedTheme}`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="relative p-10 w-[500px] bg-white rounded-2xl shadow-2xl">
        {/* ✅ Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 z-50 flex items-center justify-center rounded-2xl">
            <Lottie animationData={loadingAnime} loop={true} className="w-24 h-24" />
          </div>
        )}

        <h2 className="text-3xl font-bold text-center mb-8">Theme Settings</h2>

        <div>
          <p className="text-gray-600 mb-4 text-center text-lg">Appearance</p>
          <div className="flex gap-5 justify-center">
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={`relative flex-1 p-6 rounded-xl border flex flex-col items-center justify-center h-32 
                  ${selectedTheme === theme.id ? "border-black" : theme.borderColor} 
                  ${theme.bgColor} transition duration-200`}
                onClick={() => setSelectedTheme(theme.id)}
                disabled={loading} // ⛔ Prevent interaction during loading
              >
                {/* Inset Smaller Card */}
                <div className={`absolute inset-4 rounded-lg ${theme.insetBg} flex items-center justify-center`}>
                  <p className={`text-xl font-bold ${theme.insetText}`}>Aa</p>
                </div>

                {/* System Theme Split Effect */}
                {theme.id === "system" && (
                  <div className="absolute inset-y-4 right-4 w-1/3 bg-white rounded-lg flex items-center justify-center">
                    <p className="text-black text-xl font-bold">Aa</p>
                  </div>
                )}

                {/* Checkmark for Selected Theme */}
                {selectedTheme === theme.id && (
                  <span className="absolute bottom-4 right-4 bg-black text-white text-lg rounded-full w-7 h-7 flex items-center justify-center">
                    ✔
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          className="mt-8 w-full bg-green-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSave}
          disabled={loading}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ThemeSettings;
