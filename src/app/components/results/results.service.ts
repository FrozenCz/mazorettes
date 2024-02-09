import {Injectable} from '@angular/core';
import {Assignee, AssigneeDTO, Category, Result, ResultService} from './model';
import {map, Observable, ReplaySubject, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {restIp} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class ResultsServiceImpl implements ResultService {
  private updateHandler$: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(private httpClient: HttpClient) {
    this.updateHandler$.next();
  }
  checkResults(): void {
    return this.updateHandler$.next()
  }

  getResults$(): Observable<Assignee[]> {
    return this.httpClient.get<AssigneeDTO[]>(restIp + '/mazorettes').pipe(map(results => {
      return results.map(result => {
        return {
          ...result,
          totalNumber: this.getTotalNumber(result)
        }
      })
    })
    )
  }


  private getTotalNumber(result: AssigneeDTO) {
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

    if([Category.duo, Category.trio].includes(result.mainCategory)) {
      totalNumber = totalNumber + this.getTotalNumberFromResults([result.synchro]);
    }

    if (result.mainCategory === Category.group) {
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
