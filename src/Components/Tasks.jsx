import { useState } from "react";
import "./Tasks.css";
import { isDone } from "./utils.jsx";
// Komponent do zarządzania zadaniami
const Tasks = ({ tasks, setTasks, language, currentUser }) => {
  // Używamy useState do zarządzania widocznością formularza dodawania zadania i danymi formularza
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ description: "", date: "", time: "" });
  // Używamy useState do zarządzania komponentem -> albo 'mine' czyli moje zadania, albo 'others' czyli zadania innych użytkowników
  const [tab, setTab] = useState("mine"); // "mine" or "others"
  // Funkcja do dodawania nowego zadania
  const addTask = () => {
    const { description, date, time } = formData;
    if (!description.trim() || !date || !time) {
      // Sprawdzamy czy wszystkie pola są wypełnione
      alert(language === "pl" ? "Uzupełnij opis, datę i godzinę." : "Fill in description, date and time.");
      return;
    }
    // Sprawdzamy czy data i godzina są poprawne
    const deadline = new Date(`${date}T${time}`);
    const now = new Date();
    // Sprawdzamy czy deadline jest w przyszłości i nie jest większy niż 5 lat do przodu
    const maxYear = new Date().getFullYear() + 5;
    if (deadline.getFullYear() > maxYear) {
      alert(language === "pl" ? `Rok nie może być większy niż 5 lat do przodu (${maxYear}).` : `Year cannot be greater than 5 years ahead (${maxYear}).`);
      return;
    }
    if (deadline <= now) {
      alert(language === "pl" ? "Termin musi być późniejszy niż obecna godzina." : "Deadline must be later than current time.");
      return;
    }
    // Dodajemy nowe zadanie do listy zadań
    setTasks([...tasks, { description, deadline: deadline.toISOString(), createdBy: currentUser, done: false }]);
    // Resetujemy dane formularza i ustawiamy widoczność formularza na false
    setFormData({ description: "", date: "", time: "" });
    setShowForm(false);
  };
  // Funkcja do pobierania dzisiejszej daty
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };
  // Funkcje do usuwania zadania
  const removeTask = (indexToRemove) => {
    setTasks(tasks.filter((_, index) => index !== indexToRemove));
  };
  // Funkcje do oznaczania zadania jako wykonane
  const markAsDone = (indexToMark) => {
    const updatedTasks = tasks.map((task, index) => {
      if (index === indexToMark) {
        return { ...task, done: true };
      }
      return task;
    });
    setTasks(updatedTasks);
  };
  // Funkcje do oznaczania zadania jako niewykonane
  const markAsNotDone = (indexToMark) => {
    const updatedTasks = tasks.map((task, index) => {
      if (index === indexToMark) {
        return { ...task, done: false };
      }
      return task;
    });
    setTasks(updatedTasks);
  };
  // Filtrujemy zadania w zależności od wybranej zakładki
  // Jeśli tab jest "mine", to pokazujemy tylko zadania stworzone przez aktualnego użytkownika, w przeciwnym razie pokazujemy zadania innych użytkowników
  const filteredTasks = tasks.filter(task =>
    tab === "mine" ? task.createdBy === currentUser : task.createdBy !== currentUser
  );

  return (
    <div className="tasks-container">
      <h2 className="section-title">
        {language === "pl" ? "Zadania" : "Tasks"}
      </h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <button
          onClick={() => setTab("mine")}
          style={{
            backgroundColor: tab === "mine" ? "#3498db" : "#ccc",
            color: tab === "mine" ? "#fff" : "#000",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            cursor: "pointer"
          }}
        >
          {language === "pl" ? "Moje zadania" : "My Tasks"}
        </button>
        <button
          onClick={() => setTab("others")}
          style={{
            backgroundColor: tab === "others" ? "#3498db" : "#ccc",
            color: tab === "others" ? "#fff" : "#000",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            cursor: "pointer"
          }}
        >
          {language === "pl" ? "Zadania innych" : "Other's users tasks"}
        </button>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 && (
          <p>{language === "pl" ? "Brak zadań." : "No tasks."}</p>
        )}
        {filteredTasks.map((task, index) => (
          <div className={`task-card${task.done ? " done" : ""}`} key={index}>
            <h3>{task.description}</h3>
            <p style={({fontSize: "0.85rem", color: "#666"})}>
              {language === "pl" ? "Termin:" : "Deadline:"}{" "}
              {new Date(task.deadline).toLocaleDateString(language === "pl" ? "pl-PL" : "en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}{" "}
              {new Date(task.deadline).toLocaleTimeString(language === "pl" ? "pl-PL" : "en-GB", {
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#666" }}>
              {language === "pl" ? "Utworzone przez" : "Created by"}: <strong>{task.createdBy}</strong>
            </p>
            <p style={{ fontSize: "0.85rem", color: "#666", fontWeight: "bold" }}>
              {language === "pl" ? "Status:" : "Status:"} <strong>{isDone(task)}</strong>
            </p>

            {task.createdBy === currentUser && (
              <div className="task-actions">
                  <button className="delete-button" onClick={() => removeTask(tasks.indexOf(task))}>
                    {language === "pl" ? "Usuń" : "Delete"}
                  </button>
                  {/* Sprawdzamy czy zadanie jest wykonane, jeśli tak to pokazujemy przycisk do oznaczenia jako niewykonane, w przeciwnym razie pokazujemy przycisk do oznaczenia jako wykonane */}
                  <button
                    className="done-button"
                    onClick={() =>
                      task.done
                        ? markAsNotDone(tasks.indexOf(task))
                        : markAsDone(tasks.indexOf(task))
                    }
                  >
                    {task.done
                      ? language === "pl"
                        ? "Oznacz jako niewykonane"
                        : "Mark as not done"
                      : language === "pl"
                        ? "Oznacz jako wykonane"
                        : "Mark as done"}
                  </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Jeśli tab jest "mine" i nie pokazujemy formularza, to pokazujemy przycisk do dodania nowego zadania */}
      {tab === "mine" && !showForm && (
        <button className="add-task-button" onClick={() => setShowForm(true)}>
          {language === "pl" ? "Dodaj nowe zadanie" : "Add new task"}
        </button>
      )}

      {showForm && tab === "mine" && (
        <div className="task-form">
          <h3>{language === "pl" ? "Nowe zadanie" : "New Task"}</h3>
          <input
            type="text"
            placeholder={language === "pl" ? "Opis zadania" : "Task description"}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="date"
            value={formData.date}
            min={getTodayDate()}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          />
          <div className="form-buttons">
            <button onClick={addTask}>{language === "pl" ? "Zapisz" : "Save"}</button>
            <button onClick={() => setShowForm(false)}>{language === "pl" ? "Anuluj" : "Cancel"}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
