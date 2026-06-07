import { iafWeekFormat } from "../../common/iafWeek";

export default class FlightData {
  dateTime: Date;
  date: string;
  flightNumber: number;
  flightName: string;
  instructorName: string;
  _observer: string;
  startTime: string;
  flightTime: number | string;
  platform: string;
  _malfNumbers: number[];
  _airCrew1: string | undefined;
  _airCrew2: string | undefined;
  _block: string | undefined;
  _disruption: string | boolean | undefined;
  _navigator: string | undefined;
  _pilot: string | undefined;
  _technician: string | undefined;
  _timeOffFlight: string | undefined;
  _130: string | undefined;
  _131: string | undefined;
  _132: string | undefined;
  _133: string | undefined;
  _140: string | undefined;
  _141: string | undefined;
  _142: string | undefined;
  _143: string | undefined;
  _configuration: string | undefined;
  _inspectorInstructor: string | undefined;
  _iafWeek: number;

  constructor(
    {dateTime = new Date(),
    flightNumber = 0,
    flightName = "",
    instructorName = "",
    observer = "",
    flightTime = 0,
    platform = "",
    malfNumbers = [],
    airCrew1 = undefined,
    airCrew2 = undefined,
    block = undefined,
    disruption = undefined,
    navigator = undefined,
    pilot = undefined,
    technician = undefined,
    timeOffFlight = undefined,
    _130 = undefined,
    _131 = undefined,
    _132 = undefined,
    _133 = undefined,
    _140 = undefined,
    _141 = undefined,
    _142 = undefined,
    _143 = undefined,
    configuration = undefined,
    inspectorInstructor = undefined}
  ) {
    this.dateTime = dateTime;
    this.date = dateTime.toLocaleDateString("en-GB");
    this.flightNumber = flightNumber;
    this.flightName = flightName;
    this.instructorName = instructorName;
    this._observer = observer;
    this.startTime = dateTime.toLocaleTimeString([], {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
    this.flightTime = formatSecondsToTime(flightTime);
    this.platform = platform;
    this._malfNumbers = malfNumbers;
    this._airCrew1 = airCrew1;
    this._airCrew2 = airCrew2;
    this._block = block;
    this._disruption = disruption;
    this._navigator = navigator;
    this._pilot = pilot;
    this._technician = technician;
    this._timeOffFlight = timeOffFlight;
    this._130 = _130;
    this._131 = _131;
    this._132 = _132;
    this._133 = _133;
    this._140 = _140;
    this._141 = _141;
    this._142 = _142;
    this._143 = _143;
    this._configuration = configuration;
    this._inspectorInstructor = inspectorInstructor;
    this._iafWeek = iafWeekFormat(this.dateTime);    
  }
}

const formatSecondsToTime = (totalSeconds: number | string): string => {
  const parsedSeconds = Number(totalSeconds) || 0;
  const hours = Math.floor(parsedSeconds / 3600);
  const minutes = Math.floor((parsedSeconds % 3600) / 60);
  const seconds = parsedSeconds % 60;

  return `${hours}:${minutes}:${seconds}`;
};

export const flightObjectFromFetch = (flight: any) => {
  return new FlightData({
    ...flight,
    dateTime: new Date(flight.dateTime),
    flightNumber: flight._id,
    instructorName: flight.instructorName||flight.instructorName || flight.instructor || "" || flight.instructor?.name,
    observer: flight.observer?.name,
    _130: flight["130"],
    _131: flight["131"],
    _132: flight["132"],
    _133: flight["133"],
    _140: flight["140"],
    _141: flight["141"],
    _142: flight["142"],
    _143: flight["143"],
    malfNumbers: flight._malfNumbers ?? flight.malfNumbers ?? [],
  });
};
