import React, { useState } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "12345") {
      setMessage("✅ Login Successful! Welcome, Admin!");
    } else {
      setMessage("❌ Invalid username or password!");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login Page</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      <p style={styles.message}>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    backgroundColor: "#f1faee",
    padding: "40px",
    borderRadius: "20px",
    width: "350px",
    margin: "100px auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  title: {
    color: "#1d3557",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px",
    border: "2px solid #a8dadc",
    borderRadius: "8px",
    outline: "none",
  },
  button: {
    backgroundColor: "#457b9d",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  message: {
    marginTop: "20px",
    color: "#e63946",
  },
};

export default LoginPage;
