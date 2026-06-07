import { PermitStatus } from "../statuses";
import IssueData from "./issues";

export default class PermitData {
  _id: number;
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
    { _id = -1,
      dateTime = new Date(),
      platform = "סופה",
      permitName = "רגיל",
      permitDescription = "אין",
      openBy = "",
      expiredDate = new Date(),
      closedBy = "",
      closeDate = new Date(),
      permitStatus = PermitStatus.Open }
  ) {
    this._id = _id;
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

export const PermitObjectFromFetch = (permit: { 
  _id: number, 
  platform: string, 
  configuration: string, 
  dome: number, 
  permissionName: string, 
  permissionDescription: string, 
  permissionOpener: string, 
  openingDate: string, 
  expirationDate?: string | number | Date,
  closedBy?: string,
  closeDate?: string | number | Date,
  status: string,
}) => {  
  const status =
    permit.status && permit.status in PermitStatus
      ? PermitStatus[permit.status as keyof typeof PermitStatus]
      : permit.status;

  return new PermitData({
    ...permit,
    dateTime: new Date(permit.openingDate),
    permitName: permit.permissionName,
    permitDescription: permit.permissionDescription,
    openBy: permit.permissionOpener,
    expiredDate: permit.expirationDate
      ? new Date(permit.expirationDate)
      : undefined,
    closedBy: permit.closedBy,
    closeDate: permit.closeDate ? new Date(permit.closeDate) : undefined,
    permitStatus: status as PermitStatus,
  });
};

export const getPermitColor = (row: PermitData | IssueData) => {
  return Object.keys(PermitStatus)
    .filter((value) => PermitStatus[value as keyof typeof PermitStatus] === row.permitStatus)[0]
    .toLocaleLowerCase();
};
