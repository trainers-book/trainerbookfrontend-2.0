export default class FlightData {
  dateTime: Date;
  date: string;
  flightNumber: number;
  flightName: string;
  instructorName: string;
  observer: string;
  airCrew1: string;
  airCrew2: string;
  issueDescription: string;
  startTime: string;
  flightTime: number;
  platform: string;

  constructor(
    dateTime = new Date(),
    flightNumber = 0,
    flightName = "",
    instructorName = "",
    observer = "",
    airCrew1 = "",
    airCrew2 = "",
    issueDescription = "",
    flightTime = 0,
    platform = ""
  ) {
    this.dateTime = dateTime;
    this.date = dateTime.toLocaleDateString("en-GB");
    this.flightNumber = flightNumber;
    this.flightName = flightName;
    this.instructorName = instructorName;
    this.observer = observer;
    this.airCrew1 = airCrew1;
    this.airCrew2 = airCrew2;
    this.issueDescription = issueDescription;
    this.startTime = dateTime.toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    this.flightTime = flightTime;
    this.platform = platform;
  }
}
