"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav
      style={{
        background: "#0f172a",
        color: "white",
        padding: "16px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: 0 }}>🚀 Task Manager</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <a href="/" style={linkStyle}>
          Dashboard
        </a>

        {!isLoggedIn ? (
          <>
            <a href="/login" style={linkStyle}>
              Login
            </a>
            <a href="/register" style={linkStyle}>
              Register
            </a>
          </>
        ) : (
          <button onClick={logout} style={logoutStyle}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
};

const logoutStyle = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
};