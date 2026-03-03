const fs = require("fs");

// Load data for references
const data = JSON.parse(fs.readFileSync("./data.json", "utf8"));

const aircraftNames = data.Aircraft.map((a) => a.name);
const instructorNames = data.Instructor.map((i) => i.name);
const pilotNames = data.Pilot.map((p) => p.name);
const navigatorNames = data.Navigator.map((n) => n.name);
const technicianNames = data.Technician.map((t) => t.name);
const flightNames = data.PreservedFlightNames.map((f) => f.name);
const flightFailures = data.FlightFailure;
const configurations = ["בז", "רעם", "ברק", "סופה"];
const blocks = ["c", "d", "e"];

// Date range: June 2025 to March 2026
const juneStart = new Date(2025, 5, 1).getTime();
const marchEnd = new Date(2026, 2, 31).getTime();

function randomDate() {
  return Math.floor(Math.random() * (marchEnd - juneStart)) + juneStart;
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getFlightNumber() {
  return Math.floor(Math.random() * 9000) + 1000;
}

function startTime() {
  const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const minutes = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function flightTime() {
  return Math.floor(Math.random() * 480) + 60; // 1-8 hours in minutes
}

function getRandomMalfNumbers(platform, count = 5) {
  const platformFailures = flightFailures
    .filter((f) => f.platform === platform)
    .map((f) => f.issueNumber);

  if (platformFailures.length === 0) return [];

  const result = [];
  const take = Math.min(count, platformFailures.length);
  const shuffled = platformFailures.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, take);
}

function boolOrUndef() {
  const rand = Math.random();
  if (rand < 0.3) return undefined;
  if (rand < 0.65) return true;
  return false;
}

function stringOrUndef(chance = 0.5) {
  return Math.random() < chance
    ? randomElement([...pilotNames, ...navigatorNames])
    : undefined;
}

function timeStringOrUndef() {
  if (Math.random() < 0.4) return undefined;
  const hours = String(Math.floor(Math.random() * 24)).padStart(2, "0");
  const minutes = String(Math.floor(Math.random() * 60)).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function generateEntry(index, isברק) {
  const platform = isברק ? "ברק" : randomElement(aircraftNames);
  const hasAllProperties = Math.random() < 0.25;
  const hasManyUndefined = Math.random() < 0.35 && !hasAllProperties;

  let entry = {
    dateTime: randomDate(),
    flightNumber: getFlightNumber(),
    flightName: randomElement(flightNames),
    instructorName: randomElement(instructorNames),
    startTime: startTime(),
    flightTime: flightTime(),
    platform: platform,
    observer: randomElement(instructorNames),
    malfNumbers: getRandomMalfNumbers(
      platform,
      Math.floor(Math.random() * 8) + 1,
    ),
  };

  // Different strategies for undefined properties
  if (hasManyUndefined) {
    // Many undefined
    entry.airCrew1 =
      Math.random() < 0.3 ? randomElement(pilotNames) : undefined;
    entry.airCrew2 = undefined;
    entry.block = undefined;
    entry.disruption = undefined;
    entry.navigator = undefined;
    entry.pilot = undefined;
    entry.technician = undefined;
    entry.timeOffFlight = undefined;
  } else if (hasAllProperties) {
    // All properties defined
    entry.airCrew1 = randomElement(pilotNames);
    entry.airCrew2 = randomElement(navigatorNames);
    entry.block = randomElement(blocks);
    entry.disruption = Math.random() < 0.5;
    entry.navigator = randomElement(navigatorNames);
    entry.pilot = randomElement(pilotNames);
    entry.technician = randomElement(technicianNames);
    entry.timeOffFlight = timeStringOrUndef();
  } else {
    // Mixed - some undefined, some defined
    entry.airCrew1 =
      Math.random() < 0.6 ? randomElement(pilotNames) : undefined;
    entry.airCrew2 =
      Math.random() < 0.6 ? randomElement(navigatorNames) : undefined;
    entry.block = Math.random() < 0.5 ? randomElement(blocks) : undefined;
    entry.disruption = Math.random() < 0.5 ? boolOrUndef() : undefined;
    entry.navigator =
      Math.random() < 0.6 ? randomElement(navigatorNames) : undefined;
    entry.pilot = Math.random() < 0.6 ? randomElement(pilotNames) : undefined;
    entry.technician =
      Math.random() < 0.6 ? randomElement(technicianNames) : undefined;
    entry.timeOffFlight = Math.random() < 0.5 ? timeStringOrUndef() : undefined;
  }

  // Optional numbered fields 130-143
  const fields = ["130", "131", "132", "133", "140", "141", "142", "143"];
  fields.forEach((field) => {
    if (Math.random() < (hasAllProperties ? 0.7 : 0.4)) {
      entry[field] = randomElement([
        "operational",
        "degraded",
        "inop",
        "test",
        "pending",
      ]);
    }
  });

  // Optional configuration
  if (Math.random() < (hasAllProperties ? 0.8 : 0.35)) {
    entry.configuration = randomElement(configurations);
  }

  // Optional inspectorInstructor (must be different from instructorName)
  if (Math.random() < (hasAllProperties ? 0.75 : 0.4)) {
    let inspector = randomElement(instructorNames);
    while (inspector === entry.instructorName) {
      inspector = randomElement(instructorNames);
    }
    entry.inspectorInstructor = inspector;
  }

  // Remove undefined entries for cleaner output (only keep number/string/boolean values)
  Object.keys(entry).forEach((key) => {
    if (entry[key] === undefined) {
      delete entry[key];
    }
  });

  return entry;
}

// Generate 100 entries with 35 ברק entries spread throughout
const entries = [];
const ברקIndices = new Set();
const ברקTotal = 35;

// Distribute 35 ברק entries throughout 100 indices
const step = Math.floor(100 / ברקTotal);
for (let i = 0; i < ברקTotal; i++) {
  let idx = i * step + Math.floor(Math.random() * (step * 0.8));
  if (idx >= 100) idx = 99 - i;
  ברקIndices.add(idx);
}

for (let i = 0; i < 100; i++) {
  entries.push(generateEntry(i, ברקIndices.has(i)));
}

// Write to file
fs.writeFileSync("preservedFlights.json", JSON.stringify(entries, null, 2));
console.log("Generated 100 PreservedFlights entries");
console.log(
  "ברק entries count:",
  entries.filter((e) => e.platform === "ברק").length,
);
