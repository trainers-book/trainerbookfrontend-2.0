const fs = require("fs");
const aircraft = [
  "ברק",
  "סופה",
  "בז",
  "רעם",
  "מלאמ",
  "עיטם",
  "מוקד",
  "זיק",
  "שובל",
];
const statuses = [
  "Active",
  "Closed",
  "Maintenance",
  "Maav",
  "Elbit",
  "Waiting",
  "Permit",
];
const severities = ["Low", "Medium", "High", "VeryHigh", "StoppedFlight"];
const namesList = [
  "Sarah Miller",
  "John Doe",
  "Emma Brown",
  "Liam Smith",
  "Olivia Jones",
];
const preserved = [
  "Maintenance A",
  "Inspection B",
  "Test Flight C",
  "Calibration D",
  "Upgrade E",
  "Review F",
  "Drill G",
  "Training H",
  "Audit I",
  "Deployment J",
  "Exercise K",
  "Simulation L",
  "Briefing M",
  "Check N",
  "Repair O",
  "Certification P",
  "Evaluation Q",
  "Debrief R",
  "Upgrade S",
  "Routine T",
];
function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randDate() {
  const start = new Date(2025, 5, 1).getTime();
  const end = new Date(2026, 2, 31).getTime();
  return Math.floor(Math.random() * (end - start) + start);
}
function randStr(len) {
  const chars = "abcdefghijklmnopqrstuvwxyz ";
  let s = "";
  for (let i = 0; i < len; i++)
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}
let failures = [];
let platformCounts = {};
for (let i = 0; i < aircraft.length; i++) platformCounts[aircraft[i]] = 0;
for (let i = 1; i <= 100; i++) {
  let plat;
  if (platformCounts["ברק"] < 30) plat = "ברק";
  else plat = rand(aircraft);
  if (i > 1 && plat === failures[i - 2].platform) {
    plat = rand(aircraft);
  }
  platformCounts[plat]++;
  let obj = {
    issueNumber: i,
    dateTime: randDate(),
    flightName: rand(preserved),
    issueOpener: rand(namesList),
    issueDescription: randStr(Math.floor(Math.random() * 486) + 15),
    issueSeverity: rand(severities),
    platform: plat,
    status: rand(statuses),
  };
  const maybe = [
    "category",
    "subCategory",
    "configuration",
    "dome",
    "closedTime",
    "_fixPeriod",
    "isVerified",
    "maintenanceActions",
    "malfSystem",
    "operator",
    "responsibleFactor",
  ];
  maybe.forEach((k) => {
    if (Math.random() < 0.5) {
      if (k === "closedTime") obj[k] = randDate();
      else if (k === "_fixPeriod")
        obj[k] =
          "" +
          Math.floor(Math.random() * 10) +
          ":" +
          Math.floor(Math.random() * 24) +
          ":" +
          Math.floor(Math.random() * 60) +
          ":" +
          Math.floor(Math.random() * 60);
      else if (k === "isVerified") obj[k] = Math.random() < 0.5;
      else obj[k] = randStr(10);
    }
  });
  failures.push(obj);
}
fs.writeFileSync("flightfailures.json", JSON.stringify(failures, null, 2));
console.log("done");
