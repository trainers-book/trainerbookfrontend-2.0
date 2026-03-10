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
    const p1 = Array.isArray(this.platforms) ? this.platforms : [this.platforms];
    const p2 = Array.isArray(user.platforms) ? user.platforms : [user.platforms];

    return (
      this.firstName == user.firstName &&
      this.lastName == user.lastName &&
      this.personalNumber == user.personalNumber &&
      p1.length == p2.length &&
      p1.every((value, index) => value == p2[index])
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
    const p1 = Array.isArray(this.platforms) ? this.platforms : [this.platforms];
    const p2 = Array.isArray(account.platforms) ? account.platforms : [account.platforms];

    return (
      this.firstName == account.firstName &&
      this.lastName == account.lastName &&
      this.personalNumber == account.personalNumber &&
      this.password == account.password &&
      this.role == account.role &&
      this.id == account.id &&
      p1.length == p2.length &&
      p1.every((value, index) => value === p2[index])
    );
  }
}

export class PreservedFlightNameData {
  _id: number;
  "!id"?: number;
  date: Date;
  name: string;
  platform: string;

  constructor(date: Date, name: string, platform: string, id: number) {
    this._id = id;
    this.date = date;
    this.name = name;
    this.platform = platform;
  }

  isEqual(flight: PreservedFlightNameData) {
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
  FLIGHT = "preservedFlightNameData",
  USERS = "userData",
  PLATFORM = "platformData",
}
