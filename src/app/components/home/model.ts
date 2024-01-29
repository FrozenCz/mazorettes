import {Observable} from 'rxjs';

export abstract class HomeService {

  abstract setRefereeNumber(refereeNumber: number): Observable<void>

  abstract isRefereeNumberSelected$(): Observable<boolean>

}
