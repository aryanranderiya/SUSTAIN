// TranslationContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default to English
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const userLang = localStorage.getItem("userLang") || "en";
    setLanguage(userLang);

    // Fetch translations based on the user's language
    fetchTranslations(userLang);
  }, []);

  const fetchTranslations = async (lang) => {
    try {
      const response = await fetch("https://your-api-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "your text to translate", // This can be dynamic
          source_lang: "en",
          target_lang: lang,
        }),
      });
      const data = await response.json();
      setTranslations(data.response); // Adjust based on the structure of your response
    } catch (error) {
      console.error("Error fetching translations:", error);
    }
  };

  return (
    <TranslationContext.Provider value={{ language, translations }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslations = () => {
  return useContext(TranslationContext);
};
