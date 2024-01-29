import {Injectable} from '@angular/core';
import {Assignee, ResultService} from './model';
import {Observable, ReplaySubject} from 'rxjs';
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
    return this.httpClient.get<Assignee[]>(restIp + '/mazorettes');
  }



}
