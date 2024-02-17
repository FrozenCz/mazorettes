import {Injectable} from '@angular/core';
import {HomeService} from './model';
import {map, Observable} from 'rxjs';
import {TokenService} from '../../services/token.service';
import {HttpClient} from '@angular/common/http';
import {restIp} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class HomeServiceImpl implements HomeService {

  constructor(private tokenService: TokenService, private httpClient: HttpClient) {
  }

  setRefereeNumber(refereeNumber: number): Observable<void> {
    return this.httpClient.post<{
      access_token: string
    }>(restIp + '/auth/referee', {refereeNumber}).pipe(map((tokenObj) => {
      if (tokenObj && TokenService.isValid(tokenObj.access_token)) {
        this.tokenService.setToken(tokenObj.access_token)
      }
    }))
  }

  isRefereeNumberSelected$(): Observable<boolean> {
    return this.tokenService.getToken().pipe(map(token => !!token.refereeNumber));
  }

  refereeNumber$(): Observable<number | undefined> {
    return this.tokenService.getToken().pipe(map(token => token.refereeNumber));
  }




}
