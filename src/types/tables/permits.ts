import { PermitStatus } from "../statuses";

export default class PermitData {
  dateTime: Date;
  platform: string;
  permitName: string;
  permitDescription: string;
  openBy: string;
  expiredDate: Date;
  closedBy: string;
  closeDate: Date;
  permitStatus: PermitStatus;

  constructor(
    dateTime = new Date(),
    platform = "סופה",
    permitName = "רגיל",
    permitDescription = "אין",
    openBy = "shahar",
    expiredDate = new Date(),
    closedBy = "liam",
    closeDate = new Date(),
    permitStatus = PermitStatus.Open
  ) {
    this.dateTime = dateTime;
    this.platform = platform;
    this.permitName = permitName;
    this.permitDescription = permitDescription;
    this.openBy = openBy;
    this.expiredDate = expiredDate;
    this.closedBy = closedBy;
    this.closeDate = closeDate;
    this.permitStatus = permitStatus;
  }
}
