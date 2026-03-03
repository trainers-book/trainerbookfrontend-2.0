const fs = require("fs");
const flights = JSON.parse(fs.readFileSync("preservedFlights.json", "utf8"));
let text = fs.readFileSync("data.json", "utf8");
let block = '"PreservedFlights": ' + JSON.stringify(flights, null, 2);
block = block
  .split("\n")
  .map((l) => "  " + l)
  .join("\n");
text = text.replace(/"PreservedFlights": \[\]/, block);
fs.writeFileSync("data.json", text);
console.log("merged", flights.length, "preserved flights");
