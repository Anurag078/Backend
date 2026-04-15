import Task from "../models/Task.js";

// ➕ Create
export const createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.user.id
    });
    res.json(task);
  } catch {
    res.status(500).json({ msg: "Error creating task" });
  }
};

// 📥 Get (ROLE BASED 🔥)
export const getTasks = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      const tasks = await Task.find().populate("user", "email name _id");
      return res.json(tasks);
    }

    const tasks = await Task.find({ user: req.user.id }).populate("user", "email name _id");
    res.json(tasks);
  } catch {
    res.status(500).json({ msg: "Error fetching tasks" });
  }
};

// ❌ Delete
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Not found" });

    // user can delete only own task
    if (req.user.role !== "admin" && task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    await task.deleteOne();

    res.json({ msg: "Deleted" });
  } catch {
    res.status(500).json({ msg: "Error deleting" });
  }
};