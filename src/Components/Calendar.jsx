import { useState } from "react";
import "./Calendar.css";
import { isDone } from "./utils.jsx";
// komponent do wyswietlania kalendarza z zadaniami
const Calendar = ({ tasks, language, currentUser }) => {
  // funkcja do ustawiania aktualnej daty i obliczania dni w miesiacu
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();
  const today = new Date();

  const weeks = [];
  let day = 1;
  // tworzenie tablicy tygodni, gdzie kazdy tydzien to tablica dni
  // zakladamy ze tydzien zaczyna sie od niedzieli (0) do soboty (6)
  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      const isBeforeStart = i === 0 && j < (startDay === 0 ? 6 : startDay - 1);
      if (isBeforeStart || day > daysInMonth) {
        week.push(null);
      } else {
        week.push(day++);
      }
    }
    weeks.push(week);
  }
  // funkcja do pobierania zadan na dany dzien
  const getTasksForDay = (day) => {
    const dateStr = new Date(year, month, day).toLocaleDateString(
      language === "pl" ? "pl-PL" : "en-GB"
    );
    // filtrujemy zadania, aby znalezc te, ktore maja deadline na dany dzien
    return tasks.filter((task) => {
      const taskDate = new Date(task.deadline).toLocaleDateString(
        language === "pl" ? "pl-PL" : "en-GB"
      );
      return taskDate === dateStr;
    });
  };
  // funkcja do zmiany miesiaca
  // offset to liczba miesiecy do przesuniecia (np. -1 to poprzedni miesiac, 1 to nastepny)
  const changeMonth = (offset) => {
    const newDate = new Date(year, month + offset, 1);
    setCurrentDate(newDate);
  };

  const weekdayNames =
    language === "pl"
      ? ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Niedz"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>←</button>
        <h2>
          {currentDate.toLocaleString(
            language === "pl" ? "pl-PL" : "en-GB",
            {
              month: "long",
              year: "numeric",
            }
          )}
        </h2>
        <button onClick={() => changeMonth(1)}>→</button>
      </div>

      <div className="calendar-grid">
        {weekdayNames.map((dayName, index) => (
          <div
            className={`day-name ${index === 5 || index === 6 ? "weekend-name" : ""}`}
            key={dayName}
          >
            {dayName}
          </div>
        ))}
        {/* mapowanie dni w kalendarzu */}
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const isToday =
              day &&
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year;
            // sprawdzam czy dany dzien jest
            const taskList = day ? getTasksForDay(day) : [];

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={`calendar-cell 
                  ${isToday ? "today" : ""} 
                  ${dayIndex === 5 || dayIndex === 6 ? "weekend-cell" : ""}`}
              >
                {day && (
                  <>
                    <div className="date-number">{day}</div>
                    <ul className="tasks-list">
                      {taskList.map((task, idx) => {
                        const time = task.deadline
                          ? new Date(task.deadline).toLocaleTimeString(
                              language === "pl" ? "pl-PL" : "en-GB",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "";

                        const isOwnTask = task.createdBy === currentUser;
                        const taskClass = isOwnTask ? "task-own" : "task-other";

                        return (
                          <li
                            className={`task-item ${taskClass} ${task.done ? "done" : ""}`}
                            key={idx}
                            title={task.description}
                          >
                            <strong>{task.description}</strong>
                            {time && ` • ${time}`}
                            {task.createdBy && (
                              <>
                                <div>
                                  {language === "pl" ? "dla: " : "for: "}
                                  <strong>{task.createdBy}</strong>
                                </div>
                                <div className="task-status">
                                  <strong>{isDone(task)}</strong>
                                </div>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Calendar;
