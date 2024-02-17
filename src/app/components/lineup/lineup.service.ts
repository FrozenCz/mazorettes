import {Injectable} from '@angular/core';
import {Attendee, AttendeeDTO, LineupService} from './model';
import {Observable, of, combineLatest, map} from 'rxjs';
import {Group} from '../categories/model';
import {HttpClient} from '@angular/common/http';
import {restIp} from '../../../environments/environment';
import {Utils} from '../utils';


@Injectable()
export class LineupServiceImpl implements LineupService {


  constructor(private httpClient: HttpClient) {
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
    }))
  }

  getGroups$(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(restIp + '/groups');
  }


}
