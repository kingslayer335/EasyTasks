import React, { useState, useEffect } from "react";
import "./Login.css";
// Komponent do logowania i wyboru uzytkownika
const Login = ({ onLogin, language }) => {
  const [name, setName] = useState("");
  // Uzywamy useEffect do pobrania ostatnio uzywanych kont z localStorage
  const [recentUsers, setRecentUsers] = useState([]);
  useEffect(() => {
    // Uzywamy JSON.parse, aby przeksztalcic string z localStorage na tablice i domyslnie ustawiamy pusta tablice, jesli nie ma zapisanych uzytkownikow
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    // Ustawiamy ostatnio uzywane konta
    setRecentUsers(savedUsers);
  }, []);
  // Funkcja do logowania uzytkownika
  const handleLogin = (userName) => {
    // Sprawdzamy czy uzytkownik wpisal imie, jesli nie to nic nie robimy
    if (!userName) return;
    // Sprawdzamy czy uzytkownik juz istnieje w zapisanych kontach, jesli tak to nic nie robimy
    const savedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = Array.from(new Set([userName, ...savedUsers])).slice(0, 5); // max 5 kont
    // Aktualizujemy ostatnio uzywane konta w localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    // Ustawiamy ostatnio uzywane konta w stanie komponentu
    onLogin(userName);
  };

  return (
    <div className="login-container">
      <h2>{language === "pl" ? "Wpisz swoje imię" : "Write your name"}</h2>
      <input
        type="text"
        value={name}
        placeholder={language === "pl" ? "Wpisz imię" : "Enter your name"}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => handleLogin(name)}>{language === "pl" ? "Wejdź" : "Log in"}</button>

      <h3>{language === "pl" ? "Ostatnio używane konta:" : "Previously used accounts:"}</h3>
      <ul>
        {recentUsers.map((user, index) => (
          <li key={index}>
            <button onClick={() => handleLogin(user)}>{user}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Login;
