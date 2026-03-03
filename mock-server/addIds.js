const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

// Add _id to FlightFailure using issueNumber
if (Array.isArray(data.FlightFailure)) {
  data.FlightFailure.forEach((item) => {
    if (item.issueNumber !== undefined && item._id === undefined) {
      item._id = item.issueNumber;
    }
  });
  console.log(
    `Added _id to ${data.FlightFailure.length} FlightFailure objects`,
  );
}

// Add _id to PreservedFlights using flightNumber
if (Array.isArray(data.PreservedFlights)) {
  data.PreservedFlights.forEach((item) => {
    if (item.flightNumber !== undefined && item._id === undefined) {
      item._id = item.flightNumber;
    }
  });
  console.log(
    `Added _id to ${data.PreservedFlights.length} PreservedFlights objects`,
  );
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log("✓ data.json updated");
