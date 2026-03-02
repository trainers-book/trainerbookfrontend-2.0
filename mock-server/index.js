const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, "data.json");

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (e) {
    return {};
  }
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let db = readData();

function ensureCollection(name) {
  if (!db[name]) db[name] = [];
}

function stripFields(obj, headerValue) {
  if (!headerValue) return obj;
  let fields = [];
  try {
    fields = JSON.parse(headerValue);
    if (!Array.isArray(fields)) fields = String(headerValue).split(",");
  } catch (e) {
    fields = String(headerValue)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  const copy = { ...obj };
  fields.forEach((f) => delete copy[f]);
  return copy;
}

// GET /Authentication/:username/:password
app.get("/Authentication/:username/:password", (req, res) => {
  const { username, password } = req.params;
  ensureCollection("Authentication");
  const user = db.Authentication.find(
    (u) => u.userName === username && u.password === password,
  );
  if (user) {
    const { password: pwd, ...safe } = user;
    return res.json({ ok: true, user: safe, token: "fake-jwt-token" });
  }
  return res.status(401).json({ ok: false, message: "Invalid credentials" });
});

// PUT /setPassword  body: { userInfo: [{ userName, password }] }
// only updates existing user password; returns error if any user not found
app.put("/setPassword", (req, res) => {
  const { userInfo } = req.body || {};
  if (!Array.isArray(userInfo))
    return res
      .status(400)
      .json({ ok: false, message: "userInfo must be an array" });
  ensureCollection("Authentication");
  const missing = [];
  userInfo.forEach((ui) => {
    const existing = db.Authentication.find((u) => u.userName === ui.userName);
    if (existing) {
      existing.password = ui.password;
    } else {
      missing.push(ui.userName);
    }
  });
  if (missing.length > 0) {
    return res
      .status(404)
      .json({ ok: false, message: "users not found", users: missing });
  }
  writeData(db);
  res.json({ ok: true });
});

// POST /:collection  body: dbEntity
app.post("/:collection", (req, res) => {
  const { collection } = req.params;
  const entity = req.body || {};
  ensureCollection(collection);
  if (!entity.id) entity.id = Date.now() + Math.floor(Math.random() * 1000);
  db[collection].push(entity);
  writeData(db);
  res.status(201).json(entity);
});

// GET /getUser/:personalNumber
app.get("/getUser/:personalNumber", (req, res) => {
  const { personalNumber } = req.params;
  ensureCollection("Authentication");
  const user = db.Authentication.find(
    (u) => String(u.personalNumber) === String(personalNumber),
  );
  if (!user) return res.status(404).json({ ok: false, message: "Not found" });
  const { password, ...safe } = user;
  res.json(safe);
});

// PUT /:collectionName  body: object, optional header 'fieldstoremove' (JSON array or comma list)
app.put("/:collectionName", (req, res) => {
  const { collectionName } = req.params;
  const obj = req.body || {};
  ensureCollection(collectionName);

  let idx = -1;
  if (obj.id !== undefined)
    idx = db[collectionName].findIndex((e) => String(e.id) === String(obj.id));
  else if (obj.userName)
    idx = db[collectionName].findIndex((e) => e.userName === obj.userName);

  if (idx === -1) {
    if (!obj.id) obj.id = Date.now() + Math.floor(Math.random() * 1000);
    db[collectionName].push(obj);
    writeData(db);
    return res.status(201).json(stripFields(obj, req.headers.fieldstoremove));
  }

  db[collectionName][idx] = { ...db[collectionName][idx], ...obj };
  writeData(db);
  return res.json(
    stripFields(db[collectionName][idx], req.headers.fieldstoremove),
  );
});

// GET collection list
app.get("/:collection", (req, res) => {
  const { collection } = req.params;
  ensureCollection(collection);
  res.json(db[collection]);
});

app.listen(PORT, () => {
  console.log(`Mock server listening on http://localhost:${PORT}`);
});
