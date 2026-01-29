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

  isEqual(user: UsersData) {
    return (
      this.firstName == user.firstName &&
      this.lastName == user.lastName &&
      this.personalNumber == user.personalNumber &&
      this.platforms.length == user.platforms.length &&
      this.platforms.every((value, index) => value == user.platforms[index])
    );
  }
}

export class UsersAccountData extends UsersData {
  password: string;
  role: string;
  id: string;

  constructor(
    personalNumber: string,
    firstName: string,
    lastName: string,
    platforms: string | string[],
    password: string,
    role: string,
    id: string
  ) {
    super(
      personalNumber,
      firstName,
      lastName,
      Array.isArray(platforms) ? platforms : [platforms]
    );
    this.password = password;
    this.role = role;
    this.id = id;
  }

  isEqual(account: UsersAccountData) {
    return (
      this.firstName == account.firstName &&
      this.lastName == account.lastName &&
      this.personalNumber == account.personalNumber &&
      this.password == account.password &&
      this.role == account.role &&
      this.id == account.id &&
      this.platforms.length == account.platforms.length &&
      this.platforms.every((value, index) => value === account.platforms[index])
    );
  }
}

export class PreservedFlightNameData {
  _id: number;
  date: Date;
  name: string;
  platform: string;

  constructor(date: Date, name: string, platform: string, id: number) {
    this._id = id;
    this.date = date;
    this.name = name;
    this.platform = platform;
  }

  isEqual(flight: FlightData) {
    return (
      this.date == flight.date &&
      this.name == flight.name &&
      this.platform == flight.platform
    );
  }
}

export class PlatformData {
  id: number;
  name: string;

  constructor(name: string, id = 0) {
    this.id = id;
    this.name = name;
  }

  isEqual(platform: PlatformData) {
    return this.id == platform.id && this.name == platform.name;
  }
}

export enum Roles {
  ADMIN = "Admin",
  COMMANDER = "Commander",
  INSTRUCTOR = "Instructor",
  TECHNICIAN = "Technician",
}

export enum ManageTypes {
  FLIGHT = "flightData",
  USERS = "userData",
  PLATFORM = "platformData",
}
