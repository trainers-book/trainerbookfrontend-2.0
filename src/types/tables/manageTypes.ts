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

export class PreservedFlightNameData {
  date: Date;
  flightName: string;
  platform: string;

  constructor(
    date: Date,
    flightName: string,
    platform: string,
  ) {
    this.date = date;
    this.flightName = flightName;
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
