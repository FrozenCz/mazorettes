import {Category} from '../results/model';
import {Observable} from 'rxjs';

export interface Attendee {
  startNumber: number,
  attendees: string,
  category: Category
}

export abstract class LineupService {

  abstract getAttendees$(): Observable<Attendee[]>

}
