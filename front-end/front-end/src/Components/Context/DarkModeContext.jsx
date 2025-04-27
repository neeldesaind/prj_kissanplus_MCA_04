import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark" || storedTheme === "system") {
      return storedTheme;
    }
    return "system";
  };

  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    const htmlElement = document.documentElement;

    const applyTheme = () => {
      if (theme === "dark") {
        htmlElement.classList.add("dark");
      } else if (theme === "light") {
        htmlElement.classList.remove("dark");
      } else {
        const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (isSystemDark) {
          htmlElement.classList.add("dark");
        } else {
          htmlElement.classList.remove("dark");
        }
      }
    };

    applyTheme();
    localStorage.setItem("theme", theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  return (
    <DarkModeContext.Provider value={{ theme, setTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
}

DarkModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { DarkModeContext };
