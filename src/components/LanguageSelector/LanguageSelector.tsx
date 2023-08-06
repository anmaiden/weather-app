import { useTranslation } from "react-i18next";
import "../../i18n";
import "./LanguageSelector.css";
interface LanguageSelectorProps {
  langs: string[];
  onChange: (lang: string) => void;
}

function LanguageSelector({ langs, onChange }: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  const handleChangeLanguage = (lang: string) => {
    onChange(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => handleChangeLanguage(e.target.value)}
      className="language-select"
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
