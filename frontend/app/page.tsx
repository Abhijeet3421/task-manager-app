"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const getToken = () =>
    typeof window !== "undefined"
      ? localStorage.getItem("token") || "secret"
      : "secret";

  //  Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";
  }, []);

  //  Greeting (FIXED hydration issue)
  useEffect(() => {
    const hour = new Date().getHours();
    const g =
      hour < 12
        ? "🌅 Good Morning"
        : hour < 18
        ? "🌤 Good Afternoon"
        : "🌙 Good Evening";

    setGreeting(g);
  }, []);

  //  Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:5000/tasks", {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ title }),
    });

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchTasks();
  };

  const toggleTask = async (task: any) => {
    await fetch(`http://localhost:5000/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks();
  };

  const startEdit = (task: any) => {
    setEditId(task.id);
    setEditText(task.title);
  };

  const saveEdit = async (id: string) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ title: editText }),
    });

    setEditId(null);
    fetchTasks();
  };

  //  Smart Search + Filter
  const filteredTasks = tasks
    .filter((t) => {
      const words = search.toLowerCase().trim().split(" ");
      return words.every((w) => t.title.toLowerCase().includes(w));
    })
    .filter((t) => {
      if (filter === "all") return true;
      if (filter === "true") return t.completed;
      if (filter === "false") return !t.completed;
    });

  return (
    <div>
      {/*  HEADER */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={heading}>🚀 Smart Task Hub</h1>

        <p style={subHeading}>
          {greeting && `${greeting}, stay productive and focused ✨`}
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <span>📌 Plan</span>
          <span>⚡ Execute</span>
          <span>🏆 Complete</span>
        </div>
      </div>

      {/*  INPUTS */}
      <div style={controls}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add task..."
          style={inputStyle}
        />

        <button onClick={addTask} style={primaryBtn}>
          Add
        </button>

        <input
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="all">All Tasks</option>
          <option value="true">Completed</option>
          <option value="false">Pending</option>
        </select>
      </div>

      {/*  COUNT */}
      <p style={{ color: "white" }}>
        Showing {filteredTasks.length} of {tasks.length} tasks
      </p>

      {/*  CONTENT */}
      {loading ? (
        <p style={{ color: "white" }}>⏳ Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <div style={emptyState}>
          🚀 No tasks yet! <br />
          Start adding tasks and boost productivity 💪
        </div>
      ) : (
        <div style={{ display: "grid", gap: 15 }}>
          {filteredTasks.map((t) => (
            <div
              key={t.id}
              style={card}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.03)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div>
                {editId === t.id ? (
                  <>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      style={inputStyle}
                    />
                    <button onClick={() => saveEdit(t.id)}>💾</button>
                  </>
                ) : (
                  <>
                    <h3>📝 {t.title}</h3>
                    <span
                      style={{
                        color: t.completed ? "#4ade80" : "#facc15",
                      }}
                    >
                      {t.completed ? "Completed" : "Pending"}
                    </span>
                  </>
                )}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => toggleTask(t)} style={greenBtn}>
                  ✔
                </button>
                <button onClick={() => startEdit(t)} style={primaryBtn}>
                  ✏️
                </button>
                <button onClick={() => deleteTask(t.id)} style={redBtn}>
                  ❌
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* STYLES */

const heading = {
  color: "white",
  fontSize: "32px",
  margin: 0,
};

const subHeading = {
  color: "#cbd5f5",
  marginTop: 5,
};

const controls = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 20,
};

const inputStyle = {
  padding: "10px",
  borderRadius: 10,
  border: "none",
};

const primaryBtn = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: 8,
  cursor: "pointer",
};

const greenBtn = {
  background: "#22c55e",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: 8,
  cursor: "pointer",
};

const redBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px",
  borderRadius: 8,
  cursor: "pointer",
};

const card = {
  padding: 16,
  borderRadius: 12,
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(10px)",
  display: "flex",
  justifyContent: "space-between",
  transition: "0.3s",
};

const emptyState = {
  color: "white",
  textAlign: "center" as const,
  marginTop: 40,
  fontSize: "18px",
};