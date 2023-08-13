import React, { useState } from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./components/LanguageSelector/LanguageSelector";
import CitySearch from "./components/CitySearch/CitySearch";

// redux imports
import { Provider } from "react-redux";
import store from "./reducers//store";

const langs = ["en", "ru", "ua"];

function App() {
  const [lang, setLang] = useState("en");
  const { t } = useTranslation();

  const handleLanguageChange = (value: string) => {
    setLang(value);
  };

  return (
    <Provider store={store}>
      <div className="app-container">
        <header className="lang-container">
          <LanguageSelector langs={langs} onChange={handleLanguageChange} />
        </header>
        <CitySearch />
      </div>
    </Provider>
  );
}

export default App;
