export default class UsersData {
    firstName: string;
    lastName: string;
    personalNumber: string;
    platforms: string | string[];
  
    constructor(
      firstName="",
      lastName="",
      personalNumber="",
      platforms=[""]
    ) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.personalNumber = personalNumber;
      this.platforms = platforms
    }
  }
  