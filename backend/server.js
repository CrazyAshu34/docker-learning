import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// In-memory normal array for users
let users = [
  {
    id: 1,
    name: "Abhr",
    email: "abhr@example.com",
    password: "123",
    role: "Admin",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    password: "123",
    role: "User",
  },
];

// Simple Login route
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({ message: "Login successful", user });
});

// GET all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// POST - Create user
app.post("/api/users", (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password: password || "123",
    role: role || "User",
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT - Update user by ID
app.put("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    id, // keep same id
  };

  res.json(users[userIndex]);
});

// DELETE - Delete user by ID
app.delete("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  users = users.filter((u) => u.id !== id);
  res.json({ message: "User deleted successfully" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
