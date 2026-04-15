import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const styles = {
  container: {
    maxWidth: "400px",
    margin: "100px auto",
    padding: "40px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    backgroundColor: "white",
    fontFamily: "Arial, sans-serif"
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "30px",
    fontSize: "24px"
  },
  inputGroup: {
    marginBottom: "20px"
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#666",
    fontWeight: "bold",
    fontSize: "14px"
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "2px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    boxSizing: "border-box",
    outline: "none"
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  },
  link: {
    textAlign: "center",
    marginTop: "20px",
    color: "#007bff",
    textDecoration: "none",
    fontSize: "14px"
  },
  error: {
    color: "#dc3545",
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#f8d7da",
    borderRadius: "5px",
    textAlign: "center"
  }
};

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📝 Register</h2>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Full Name</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter your full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onKeyPress={handleKeyPress}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onKeyPress={handleKeyPress}
        />
      </div>

      <div style={styles.inputGroup}>
        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onKeyPress={handleKeyPress}
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <button onClick={handleSubmit} style={styles.button}>
        ✅ Register
      </button>

      <div style={styles.link}>
        Already have an account? <Link to="/" style={{ color: "#007bff", textDecoration: "underline" }}>Login here</Link>
      </div>
    </div>
  );
}