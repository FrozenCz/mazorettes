import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {restIp} from '../../../environments/environment';
import {ResultDTO} from './model';

@Injectable({
  providedIn: 'root'
})
export class RefereeFormService {


  constructor(private httpClient: HttpClient) {
  }

  sendResults(result: ResultDTO): Observable<void> {

    return this.httpClient.post<void>(restIp + '/mazorettes', result);

  }

}
