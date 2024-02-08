import {Injectable} from '@angular/core';
import {Assignee, AssigneeDTO, Result, ResultService} from './model';
import {map, Observable, ReplaySubject} from 'rxjs';
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
    }))
  }


  private getTotalNumber(result: AssigneeDTO) {
    return 0;
  }

  // private calculateResult(result: Result)

}
