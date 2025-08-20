export class UsersData {
  personalNumber: string;
  firstName: string;
  lastName: string;
  platforms: string | string[];

  constructor(
    personalNumber: string,
    firstName: string,
    lastName: string,
    platforms: string | string[]
  ) {
    this.personalNumber = personalNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.platforms = platforms;
  }
}

export class FlightData {
  date: Date;
  name: string;
  platform: string;

  constructor(
    date: Date,
    name: string,
    platform: string,
  ) {
    this.date = date;
    this.name = name;
    this.platform = platform;
  }
}

export class platformData {
  id: number;
  name: string;

  constructor(
    name: string,
    id = 0,
  ) {
    this.id = id;
    this.name = name;
  }
}

export enum Collections {
  PLATFORM              = "Aircraft",
  INSTRUCTOR            = "Instructor",
  INSPECTOR_INSTRUCTOR  = "InspectorInstructor",
  COMMANDER             = "Commander",
  PILOT                 = "Pilot",
  NAVIGATOR             = "Navigator",
  INSPECTOR             = "Inspector",
  TRAINER               = "Trainer",
  TECHNICIAN            = "Technician",
  PRESERVED_FLIGHTNAME  = "PreservedFlightNames",
}
