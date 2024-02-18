import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {combineLatest, map, Observable, shareReplay} from 'rxjs';
import {restIp} from '../../../environments/environment';
import {ResultDTO} from './model';
import {Attendee, AttendeeDTO} from '../lineup/model';
import {Utils} from '../utils';
import {Group} from '../categories/model';

@Injectable({
  providedIn: 'root'
})
export class RefereeFormService {


  constructor(private httpClient: HttpClient) {
  }

  sendResults(result: ResultDTO): Observable<void> {

    return this.httpClient.post<void>(restIp + '/mazorettes', result);

  }



  public getAttendees$(): Observable<Attendee[]> {
    return combineLatest([this.getGroups$().pipe(map(g => Utils.createMap(g, 'uuid'))), this.httpClient.get<AttendeeDTO[]>(restIp + '/attendees')]).pipe(map(([groups, attendees]) => {
      return attendees.map(attendee => {
        const g = groups.get(attendee.groupUuid);
        if (!g) {
          throw new Error('Group not found!' + attendee.groupUuid);
        }
        return {
          ...attendee,
          group: g
        }
      })
    }), shareReplay());
  }

  getGroups$(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(restIp + '/groups');
  }

  getAttendee$(attendeeNumber: number) {
    return this.getAttendees$().pipe(map(attendees => attendees.find(a => a.startNumber === attendeeNumber)));
  }
}
