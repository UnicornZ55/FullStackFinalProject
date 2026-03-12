import { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  const [config, setConfig] = useState({
    theme: "light",
    primaryColor: "#3b82f6"
  })

  const toggleTheme = () => {
    setConfig(prev => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light"
    }))
  }

  const changeColor = (color) => {
    setConfig(prev => ({
      ...prev,
      primaryColor: color
    }))
  }

  return (
    <ThemeContext.Provider
      value={{
        config,
        toggleTheme,
        changeColor
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}