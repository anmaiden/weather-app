import { useTranslation } from "react-i18next";
import "../../i18n";
import "./LanguageSelector.css";

// redux imports
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../reducers/store";
import { setLanguage } from "../../reducers/weatherReducer";

interface LanguageSelectorProps {
  langs: string[];
  onChange: (lang: string) => void;
}

function LanguageSelector({ langs, onChange }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const language = useSelector((state: RootState) => state.weather.language);
  const dispatch = useDispatch();
  const handleLanguageChange = (lang: "en" | "ua" | "ru") => {
    dispatch(setLanguage(lang));
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
    onChange(lang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      dispatch(setLanguage(savedLanguage as "en" | "ua" | "ru"));
      i18n.changeLanguage(savedLanguage);
      onChange(savedLanguage);
    }
  }, []);

  return (
    <select
      //check for `null` and cast the value to type `string`
      value={language ?? ""}
      className="language-select"
      onChange={(e) =>
        handleLanguageChange(e.target.value as "en" | "ua" | "ru")
      }
    >
      {langs.map((lang) => (
        <option key={lang} value={lang}>
          {lang.toUpperCase()}
        </option>
      ))}
    </select>
  );
}

export default LanguageSelector;
