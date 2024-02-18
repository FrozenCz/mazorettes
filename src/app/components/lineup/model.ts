import {Observable} from 'rxjs';
import {Group} from '../categories/model';

export interface Attendee {
  startNumber: number,
  note: string,
  group: Group
}

export interface AttendeeDTO {
  startNumber: number,
  note: string,
  groupUuid: string
}

export abstract class LineupService {

  abstract getAttendees$(): Observable<Attendee[]>

  abstract getGroups$(): Observable<Group[]>

  abstract saveAttendee(param: {note: string; startNumber: number; groupUuid: string}): Observable<void>

  abstract deleteAttendee(startNumber: number): Observable<void>
}
