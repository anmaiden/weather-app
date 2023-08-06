import React, { useState } from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./components/LanguageSelector/LanguageSelector";
import CitySearch from "./components/CitySearch/CitySearch";
import i18n from "./i18n";

const langs = ["en", "ru", "ua"];

function App() {
  const [lang, setLang] = useState("en");
  const { t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    setLang(value);
  };

  return (
    <div className="app-container">
      <div className="lang-container">
        <LanguageSelector langs={langs} onChange={handleLanguageChange} />
      </div>
      <CitySearch />
    </div>
  );
}

export default App;
