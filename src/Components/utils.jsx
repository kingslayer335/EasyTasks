// src/Components/utils.js
export const isDone = (task) =>
  task.done
    ? <span style={{ color: "#1f9725", fontSize: "1.5em" }}>✔</span>
    : <span style={{ color: "#e74c3c", fontSize: "1.5em" }}>✖</span>;
