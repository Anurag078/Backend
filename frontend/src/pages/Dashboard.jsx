import { useEffect, useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    minHeight: "100vh"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    borderBottom: "3px solid #007bff",
    paddingBottom: "15px"
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#333"
  },
  badge: {
    padding: "8px 15px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    marginRight: "10px"
  },
  adminBadge: {
    backgroundColor: "#28a745",
    color: "white"
  },
  userBadge: {
    backgroundColor: "#17a2b8",
    color: "white"
  },
  logoutBtn: {
    padding: "8px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "30px"
  },
  input: {
    flex: 1,
    padding: "12px",
    fontSize: "16px",
    border: "2px solid #ddd",
    borderRadius: "5px",
    outline: "none",
    "&:focus": {
      borderColor: "#007bff"
    }
  },
  addBtn: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold"
  },
  taskList: {
    listStyle: "none",
    padding: 0,
    margin: 0
  },
  taskItem: {
    backgroundColor: "white",
    padding: "15px",
    marginBottom: "12px",
    borderRadius: "5px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderLeft: "5px solid #007bff"
  },
  taskInfo: {
    flex: 1
  },
  taskTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    margin: "0 0 5px 0"
  },
  taskOwner: {
    fontSize: "12px",
    color: "#666",
    margin: 0
  },
  deleteBtn: {
    padding: "8px 15px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px"
  },
  emptyMessage: {
    textAlign: "center",
    color: "#999",
    padding: "40px",
    fontSize: "16px"
  }
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const currentUserId = localStorage.getItem("userId");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      alert("Error fetching tasks");
    }
  };

  const addTask = async () => {
    if (!title.trim()) return alert("Enter task title");

    try {
      await API.post("/tasks", { title });
      setTitle("");
      fetchTasks();
    } catch (err) {
      alert("Error adding task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert("Error deleting task");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    } else {
      fetchTasks();
    }
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 Task Manager</h1>
        <div>
          <span style={{
            ...styles.badge,
            ...(role === "admin" ? styles.adminBadge : styles.userBadge)
          }}>
            {role === "admin" ? "👑 ADMIN" : "👤 USER"}
          </span>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {role === "admin" && (
        <div style={{
          backgroundColor: "#d4edda",
          padding: "12px",
          borderRadius: "5px",
          marginBottom: "20px",
          color: "#155724",
          fontSize: "14px"
        }}>
          ✅ Admin Mode: You can see all tasks from all users
        </div>
      )}

      <div style={styles.inputContainer}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTask()}
          placeholder="Enter task title..."
          style={styles.input}
        />
        <button onClick={addTask} style={styles.addBtn}>
          ➕ Add Task
        </button>
      </div>

      <div>
        {tasks.length === 0 ? (
          <div style={styles.emptyMessage}>
            No tasks yet. Create one to get started! 🚀
          </div>
        ) : (
          <ul style={styles.taskList}>
            {tasks.map((t) => (
              <li key={t._id} style={styles.taskItem}>
                <div style={styles.taskInfo}>
                  <p style={styles.taskTitle}>{t.title}</p>
                  {role === "admin" && t.user && (
                    <p style={styles.taskOwner}>
                      Owner: {t.user.name} ({t.user.email})
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(t._id)}
                  style={styles.deleteBtn}
                >
                  🗑️ Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}