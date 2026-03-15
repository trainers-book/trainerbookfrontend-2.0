const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { log } = require("console");

const app = express();
const PORT = process.env.PORT || 3002;

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
    return res.status(202).json([user]);
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

// POST to /Manage with role body: { role }
// returns items from Manage collection where the role appears in any of the
// permission arrays (show/delete/edit/add) so front-end can query by auth level
app.post("/Manage", (req, res) => {
  const { role } = req.body || {};
  ensureCollection("Manage");
  if (!role) {
    return res.status(400).json({ ok: false, message: "role is required" });
  }
  const matches = db.Manage.filter((item) => {    
    return item.show.includes(role);
  });
  res.json(matches);
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

// GET /Authentication/:personalNumber
app.get("/Authentication/:personalNumber", (req, res) => {
  const { personalNumber } = req.params;
  ensureCollection("Authentication");
  const user = db.Authentication.find(
    (u) => String(u.userName) === String(personalNumber),
  );
  if (!user) return res.status(404).json({ ok: false, message: "Not found" });
  const { password, ...safe } = user;
  res.status(200).json({ ok: true });
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

// GET /:collection/getAmountByFilters/:index
// params may be sent in the request body as { params: { platform: [...], filters: {...} } }
// or as a JSON-encoded `params` query parameter. Returns 25 items at offset index*25
app.get("/:collection/getAmountByFilters/:index", (req, res) => {
  const { collection, index } = req.params;
  ensureCollection(collection);
  console.log(index);

  // read params from body.params or query.params
  let params = (req.body && req.body.params) || undefined;

  if (!params && req.query && req.query.params) {
    try {
      params = JSON.parse(req.query.params);
    } catch (e) {
      params = req.query.params;
    }
  }
  params = params || {};

  const platforms = Array.isArray(req.query.platform)
    ? req.query.platform.map((p) => JSON.parse(p))
    : req.query.platform
      ? [JSON.parse(req.query.platform)]
      : null;

  const filters = req.query.filters || {};

  let items = Array.isArray(db[collection]) ? db[collection].slice() : [];

  items = items.filter((obj) => {
    // platform membership: object must contain at least one of requested platforms
    if (platforms && platforms.length > 0) {
      const objPlat = obj.platform;
      if (Array.isArray(objPlat)) {
        if (!objPlat.some((p) => platforms.includes(p))) return false;
      } else if (typeof objPlat === "string") {
        if (!platforms.includes(objPlat)) {
          // console.log(platforms.includes(objPlat));

          return false;
        }
      } else {
        return false;
      }
    }

    // date: same-day match
    if (filters.date !== undefined) {
      const d = Number(filters.date);
      if (Number.isNaN(d)) return false;
      const start = new Date(d);
      start.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      if (!(obj.dateTime >= start.getTime() && obj.dateTime <= end.getTime()))
        return false;
    }

    // minDate / maxDate inclusive
    if (filters.minDate !== undefined) {
      const min = Number(filters.minDate);
      if (Number.isNaN(min)) return false;
      if (!(obj.dateTime >= min)) return false;
    }
    if (filters.maxDate !== undefined) {
      const max = Number(filters.maxDate);
      if (Number.isNaN(max)) return false;
      if (!(obj.dateTime <= max)) return false;
    }

    // FlightFailure-specific filters
    if (collection === "FlightFailure") {
      if (filters.failureStatus !== undefined) {
        if (obj.status !== filters.failureStatus) return false;
      }
      if (filters.issueSeverity !== undefined) {
        if (obj.issueSeverity !== filters.issueSeverity) return false;
      }
    }

    // search is intentionally ignored as requested

    return true;
  });

  // const idx = Math.max(0, parseInt(index, 10) || 0);
  // const offset = idx * 25;
  const result = items.slice(index, index + 25);
  res.json(result.sort((a, b) => a._id - b._id));
});

app.listen(PORT, () => {
  console.log(`Mock server listening on http://localhost:${PORT}`);
});
