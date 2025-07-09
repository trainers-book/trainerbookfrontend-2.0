import { Severity } from "../issuesSeverity";
import { Status } from "../statuses";

export default class IssueData {
  dateTime: Date;
  flightNumber: number;
  flightName: string;
  instructorName: string;
  issueDescription: string;
  issueSeverity: Severity;
  platform: string;
  status: Status;

  constructor(
    dateTime = new Date(),
    flightNumber = 0,
    flightName = "רגיל",
    instructorName = "מדריכה",
    issueDescription = "אין",
    platform = "בז",
    issueSeverity = Severity.low,
    status = Status.Active
  ) {
    this.dateTime = dateTime;
    this.flightNumber = flightNumber;
    this.instructorName = instructorName;
    this.flightName = flightName;
    this.platform = platform;
    this.issueDescription = issueDescription;
    this.issueSeverity = issueSeverity;
    this.status = status;
  }
}
