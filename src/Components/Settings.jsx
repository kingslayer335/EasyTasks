import "./Settings.css";
// Komponent do zarządzania ustawieniami aplikacji - wczyytuje motyw i język z localStorage, umożliwia ich zmianę
const Settings = ({ setLanguage, language, theme, setTheme }) => {
  return (
    <div className="settings-container">
      <h2>{language === "pl" ? "Ustawienia" : "Settings"}</h2>
      {/* Ustawienia motywu */}
      <div className="setting-option">
        <label>{language === "pl" ? "Motyw:" : "Theme:"}</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="light">{language === "pl" ? "Jasny" : "Light"}</option>
          <option value="dark">{language === "pl" ? "Ciemny" : "Dark"}</option>
        </select>
      </div>
      {/* Ustawienia języka */}

      <div className="setting-option">
        <label>{language === "pl" ? "Język:" : "Language:"}</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="pl">Polski</option>
          <option value="en">English</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;
