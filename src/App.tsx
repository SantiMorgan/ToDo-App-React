import React from "react";
import "./App.css";

type Todo = {
  id: string;
  title: string;
  done: boolean;
};

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "todos-v1";

function uid() {
  return (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}_${Math.random()}`);
}

export default function App() {
  const [todos, setTodos] = React.useState<Todo[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Todo[]) : [];
    } catch {
      return [];
    }
  });

  const [text, setText] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  function addTodo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const title = text.trim();
    if (!title) return;
    setTodos((prev) => [{ id: uid(), title, done: false }, ...prev]);
    setText("");
  }

  function toggleTodo(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.done));
  }

  const visibleTodos = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <main className="app-container">
      <h1>To-Do</h1>

      <form className="todo-form" onSubmit={addTodo}>
        <input
          className="todo-input"
           placeholder="Escribe una tarea…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Nueva tarea"
        />
        <button type="submit" aria-label="Agregar tarea">Agregar</button>
      </form>

      {/* Barra de acciones */}
      <div style={{ display: "flex", gap: ".5rem", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: "var(--muted)" }}>
          {remaining} pendiente{remaining !== 1 ? "s" : ""}
        </span>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            title="Mostrar todas"
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setFilter("active")}
            aria-pressed={filter === "active"}
            title="Mostrar activas"
          >
            Activas
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            aria-pressed={filter === "completed"}
            title="Mostrar completadas"
          >
            Completadas
          </button>
        </div>
        <button type="button" onClick={clearCompleted} title="Eliminar completadas">
          Limpiar completadas
        </button>
      </div>

      <ul className="todo-list">
        {visibleTodos.map((t) => (
          <li key={t.id} className="todo-item">
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTodo(t.id)}
                aria-label={`Marcar ${t.title}`}
              />
              <span className={`todo-title ${t.done ? "done" : ""}`}>{t.title}</span>
            </label>
            <button
              className="todo-remove"
              onClick={() => removeTodo(t.id)}
              aria-label={`Eliminar ${t.title}`}
              title="Eliminar"
            >
              ✕
            </button>
          </li>
        ))}

        {visibleTodos.length === 0 && (
          <li className="todo-empty">No hay tareas en este filtro.</li>
        )}
      </ul>
    </main>
  );
}
