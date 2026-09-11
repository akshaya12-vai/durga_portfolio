// Durga Devi Portfolio — Backend API
// A small Express server that:
//  1) Serves the built frontend (static files) so the whole site runs from one server
//  2) Accepts contact form submissions and stores them in data/messages.json
//  3) Serves the resume PDF for the "Download Resume" / "View Resume" buttons

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_DIR = path.join(__dirname, "data");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");

// Make sure the data folder + messages file exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, "[]", "utf-8");

app.use(cors());
app.use(express.json());

// ---------- API ROUTES ----------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Durga Devi portfolio API is running" });
});

// Contact form submission
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !name.trim() || !email || !email.trim() || !message || !message.trim()) {
    return res.status(400).json({ success: false, error: "Name, email and message are all required." });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({ success: false, error: "Please provide a valid email address." });
  }

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    receivedAt: new Date().toISOString(),
  };

  try {
    const existing = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8") || "[]");
    existing.push(entry);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(existing, null, 2), "utf-8");
    return res.status(201).json({ success: true, message: "Message received. Thank you for reaching out!" });
  } catch (err) {
    console.error("Failed to save message:", err);
    return res.status(500).json({ success: false, error: "Something went wrong while saving your message." });
  }
});

// (Admin/testing helper) list stored messages
app.get("/api/messages", (req, res) => {
  try {
    const existing = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8") || "[]");
    res.json({ success: true, count: existing.length, messages: existing });
  } catch (err) {
    res.status(500).json({ success: false, error: "Could not read messages." });
  }
});

// Resume download
app.get("/api/resume", (req, res) => {
  const resumePath = path.join(FRONTEND_DIR, "assets", "Durga_Devi_Resume.pdf");
  if (!fs.existsSync(resumePath)) {
    return res.status(404).json({ success: false, error: "Resume file not found." });
  }
  res.download(resumePath, "Durga_Devi_Resume.pdf");
});

// ---------- STATIC FRONTEND ----------
app.use(express.static(FRONTEND_DIR));

// Fallback to index.html for any non-API route (simple SPA-style fallback)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

app.listen(PORT, () => {
  console.log(`\n🦋  Durga Devi's portfolio server is running`);
  console.log(`    → http://localhost:${PORT}\n`);
});
