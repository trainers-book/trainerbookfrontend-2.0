const fs = require("fs");
const failures = JSON.parse(fs.readFileSync("flightfailures.json"));
let text = fs.readFileSync("data.json", "utf8");
let block = '"FlightFailure": ' + JSON.stringify(failures, null, 2);
block = block
  .split("\n")
  .map((l) => "  " + l)
  .join("\n");
block += ",";
text = text.replace(/\"FlightFailure\": \[[\s\S]*\],/, block);
fs.writeFileSync("data.json", text);
console.log("patched greedy");
