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
  flightName: string;
  platform: string;

  constructor(
    flightName: string,
    platform: string,
    date = new Date()
  ) {
    this.flightName = flightName;
    this.platform = platform;
    this.date = date;
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

// export type AirCrew1 = UsersData;
// export type AirCrew2 = UsersData;
// export type Instructor = UsersData;
