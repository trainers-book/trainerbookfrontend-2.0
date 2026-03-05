export enum Status {
  Active = "פתוח",
  Closed = "סגור",
  Maintenance = "ייבדק ביום אחזקה", // יבדק באחזקה
  Maav = 'יבדק במא"ב',
  Elbit = "הנדסה",
  Waiting = "מחכה לחלקים",
}

export enum PermitStatus {
  Open = "פתוח",
  Resolved = "סגור",
  Expired = "פג תוקף",
}
