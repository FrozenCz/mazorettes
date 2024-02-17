import {Injectable} from '@angular/core';
import {Attendee, LineupService} from './model';
import {Observable, of} from 'rxjs';

@Injectable()
export class LineupServiceImpl implements LineupService{


  public getAttendees$(): Observable<Attendee[]> {
    return of([]);
  }


}
