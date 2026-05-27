import { Severity } from "../issuesSeverity";
import { Status } from "../statuses";

export default class IssueData {
  issueNumber: number;
  dateTime: Date;
  flightName: string;
  issueOpener: string;
  issueDescription: string;
  issueSeverity: Severity;
  platform: string;
  status: Status;
  _category: string | undefined;
  _subCategory: string | undefined;
  _configuration: string | undefined;
  _dome: string | undefined;
  _closedTime: Date | undefined;
  _fixPeriod: Date | string | undefined;
  _isVerified: string | boolean | undefined;
  _maintenanceActions: string | undefined;
  _malfSystem: string | undefined;
  _operator: string | undefined;
  _responsibleFactor: string | undefined;

  constructor({
    dateTime = new Date(),
    issueNumber = 0,
    flightName = "רגיל",
    issueOpener = "מדריכה",
    issueDescription = "אין",
    platform = "בז",
    issueSeverity = Severity.Low,
    status = Status.Active,
    category = undefined,
    subCategory = undefined,
    configuration = undefined,
    dome = undefined,
    closedTime = undefined,
    fixPeriod = undefined,
    isVerified = undefined,
    maintenanceActions = undefined,
    malfSystem = undefined,
    operator = undefined,
    responsibleFactor = undefined,
  }) {
    this.dateTime = dateTime;
    this.issueNumber = issueNumber;
    this.issueOpener = issueOpener;
    this.flightName = flightName;
    this.platform = platform;
    this.issueDescription = issueDescription;
    this.issueSeverity = issueSeverity;
    this.status = status;
    this._category = category;
    this._subCategory = subCategory;
    this._configuration = configuration;
    this._dome = dome;
    this._closedTime = closedTime;
    this._fixPeriod = fixPeriod;
    this._isVerified = isVerified;
    this._maintenanceActions = maintenanceActions;
    this._malfSystem = malfSystem;
    this._operator = operator;
    this._responsibleFactor = responsibleFactor;
  }
}

export const IssueObjectFromFetch = (malf: any) => {  
  return new IssueData({
    ...malf,
    dateTime: new Date(malf.dateTime),
    issueNumber: malf._id,
    status: Status[malf.status as keyof typeof Status],
    issueDescription: malf.issueDescription,
    issueSeverity: malf.issueSeverity,
    issueOpener: malf.issueOpener,
  });
};

export const getIssueColor = (row: IssueData) => {
  return Object.keys(Status)
    .filter((value) => Status[value as keyof typeof Status] === row.status)[0]
    .toLocaleLowerCase();
};