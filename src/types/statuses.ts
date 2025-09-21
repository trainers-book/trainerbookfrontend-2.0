export enum Status {
  Active = "פתוח",
  Closed = "סגור",
  Maintenance = "ייבדק ביום אחזקה", // יבדק באחזקה
  Maav = 'יבדק במא"ב',
  Elbit = "פתוח להנדסה",
  Waiting = "מחכה לחלקים"
} // we can change the name in the db itself or in here (the name in hebrew that will be displayed in the table)
