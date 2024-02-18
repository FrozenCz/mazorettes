import {Injectable} from '@angular/core';
import {Assignee, AssigneeDTO, Category, Result, ResultService} from './model';
import {map, Observable, ReplaySubject, combineLatest} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {restIp} from '../../../environments/environment';
import {Group} from '../categories/model';
import {AttendeeDTO} from '../lineup/model';
import {Utils} from '../utils';
import {DisciplineMap} from '../../shared/model';

@Injectable({providedIn: 'root'})
export class ResultsServiceImpl implements ResultService {
  private updateHandler$: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(private httpClient: HttpClient) {
    this.updateHandler$.next();
  }

  checkResults(): void {
    return this.updateHandler$.next()
  }

  getGroups$(): Observable<Group[]> {
    return this.httpClient.get<Group[]>(restIp + '/groups');
  }

  getResults$(): Observable<Assignee[]> {
    return combineLatest([this.httpClient.get<AssigneeDTO[]>(restIp + '/mazorettes'),
      this.httpClient.get<Group[]>(restIp + '/groups').pipe(map(g => Utils.createMap(g, 'uuid'))),
      this.httpClient.get<AttendeeDTO[]>(restIp + '/attendees').pipe(map(a => Utils.createMap(a, 'startNumber')))])
      .pipe(map(([results, groups, attendees]) => {
          return results.map(result => {
            const attendee = attendees.get(result.ordNumber.toString())
            if (!attendee) {
              throw new Error('Attendee not found, ordNumber in result  ' + result.ordNumber);
            }

            const group = groups.get(attendee.groupUuid);
            if (!group) {
              throw new Error('Group not found, uuid: ' + attendee.groupUuid);
            }

            const resultBy = DisciplineMap.get(group.resultBy);
            if (resultBy === undefined) {
              throw new Error('Result by not found ' + group.resultBy);
            }

            return {
              ...result,
              resultBy,
              attendeeNote: attendee.note,
              categoryName: group.name,
              categoryUuid: group.uuid,
              totalNumber: this.getTotalNumber(result, group.resultBy)
            }
          })
        })
      )
  }


  private getTotalNumber(result: AssigneeDTO, category: Category) {
    let totalNumber = 0;
    totalNumber = this.getTotalNumberFromResults([
      result.choreography,
      result.difficulty,
      result.costumes,
      result.overall,
      result.facialExpression,
      result.music,
      result.faults,
    ]);

    if ([Category.duo].includes(category)) {
      totalNumber = totalNumber + this.getTotalNumberFromResults([result.synchro]);
    }

    if (category === Category.group) {
      totalNumber = totalNumber + this.getTotalNumberFromResults([result.synchro, result.formationChange])
    }

    return totalNumber;
  }


  private getTotalNumberFromResults(results: Result[]) {
    let totalNum = 0;
    results.forEach(result => {
      for (let key in result) {
        totalNum = totalNum + result[key];
      }
    })

    return totalNum;
  }
}
