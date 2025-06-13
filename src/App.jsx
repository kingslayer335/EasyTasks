import { useState, useEffect } from "react";
import "./App.css";
import Tasks from "./Components/Tasks";
import Calendar from "./Components/Calendar";
import Settings from "./Components/Settings";
import Login from "./Components/Login";

const App = () => {
  const [user, setUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [language, setLanguage] = useState("pl");
  const [theme, setTheme] = useState("light");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // do obslugi gestow dotykowych na tel
  let touchStartX = 0;
  let touchEndX = 0;

  // zapisujemy dotyk poczatkowy
  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };
  // sprawdzamy czy przesuniecie bylo w lewo, jeśli tak to zamykamy sidebar
  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      setSidebarOpen(false); 
    }
  };
  // ustawiamy klase body na aktualny motyw, to pozwala na łatwą zmianę stylów w CSS
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);
  // sprawdza czy jest zapisany użytkownik w localStorage (jeśli tak to ustawia go jako aktualnego użytkownika)
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);
  // zapisuje aktualnego użytkownika do localStorage, aby nie trzeba było się logować za każdym razem
  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", user);
    }
  }, [user]);
  // sprawdza czy uzytkownik jest zapisany, jeśli nie to ustawia domyslne okno logowania
  if (!user) {
    return <Login onLogin={setUser} language={language} />;
  }
  
  return (
    <div
      className={`app-layout ${theme}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* otwierane menu 'hamburger' na urzadzeniach mobilnych */}
      {!sidebarOpen && (
        <button className="hamburger bottom" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      )}

      {/* boczne menu 'sidebar' */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* przycisk zamykający menu na urzadzeniach mobilnych */}
        <h2 className="sidebar-title" onClick={() => { setSelectedOption(null); setSidebarOpen(false); }}>
          EasyTasks
        </h2>
        <ul className="sidebar-list">
          <li onClick={() => { setSelectedOption("Moje zadania"); setSidebarOpen(false); }}>
            {language === "pl" ? "Zadania" : "Tasks"}
          </li>
          <li onClick={() => { setSelectedOption("Kalendarz"); setSidebarOpen(false); }}>
            {language === "pl" ? "Kalendarz" : "Calendar"}
          </li>
          <li onClick={() => { setSelectedOption("Ustawienia"); setSidebarOpen(false); }}>
            {language === "pl" ? "Ustawienia" : "Settings"}
          </li>
          <li
            onClick={() => setUser(null)}
            style={{ marginTop: "1rem", cursor: "pointer" }}
          >
            {language === "pl" ? "Wyloguj" : "Logout"} ({user})
          </li>
        </ul>
      </aside>

      {/* MAIN */}
      {/* jesli gdzies sie kliknie to zamyka menu boczne */}
      <main className="main-content" onClick={() => setSidebarOpen(false)}>
        {selectedOption === "Moje zadania" && (
          <Tasks tasks={tasks} setTasks={setTasks} language={language} currentUser={user} />
        )}
        {selectedOption === "Kalendarz" && (
          <Calendar tasks={tasks} language={language} currentUser={user} />
        )}
        {selectedOption === "Ustawienia" && (
          <Settings language={language} setLanguage={setLanguage} theme={theme} setTheme={setTheme} />
        )}
        {/* to jest domyślna strona, aby na nia wejsc trzeba kliknac w nazwe strony na sidebarze */}
        {selectedOption === null && (
          <div className="banner">
            {language === "pl" ? (
              <>
                <h1>Witamy w aplikacji EasyTasks</h1>
                <p>
                  To Twoje centrum zarządzania zadaniami. Wybierz opcję z menu po lewej,
                  aby dodać, śledzić i zarządzać swoimi zadaniami już teraz.
                </p>
              </>
            ) : (
              <>
                <h1>Welcome to EasyTasks</h1>
                <p>
                  This is your task management hub. Choose an option from the menu on the left
                  to add, track, and manage your tasks now.
                </p>
              </>
            )}
            <img
              src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
              alt={language === "pl" ? "Zadania" : "Tasks"}
              className="banner-img"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
