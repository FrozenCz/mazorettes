import {Injectable} from '@angular/core';
import {Attendee, AttendeeDTO, LineupService} from './model';
import {combineLatest, map, Observable, ReplaySubject, shareReplay, switchMap, tap} from 'rxjs';
import {Group} from '../categories/model';
import {HttpClient} from '@angular/common/http';
import {restIp} from '../../../environments/environment';
import {Utils} from '../utils';


@Injectable({
  providedIn: 'root'
})
export class LineupServiceImpl implements LineupService {

  private refresh$: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(private httpClient: HttpClient) {
    this.refresh$.next();
  }

  public getAttendees$(): Observable<Attendee[]> {
    return this.refresh$.pipe(switchMap(() => combineLatest([this.getGroups$().pipe(map(g => Utils.createMap(g, 'uuid'))), this.httpClient.get<AttendeeDTO[]>(restIp + '/attendees')]).pipe(map(([groups, attendees]) => {
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
    }))), shareReplay());
  }

  getGroups$(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(restIp + '/groups');
  }

  saveAttendee(param: { note: string; startNumber: number; groupUuid: string }): Observable<void> {
    const {note, groupUuid, startNumber} = param;
    return this.httpClient.put<void>(restIp + '/attendees/' + startNumber, {
      note,
      groupUuid
    }).pipe(tap(() => this.refresh$.next()));
  }

  deleteAttendee(startNumber: number): Observable<void> {
    return this.httpClient.delete<void>(restIp + '/attendees/' + startNumber).pipe(tap(() => this.refresh$.next()));
  }


}
