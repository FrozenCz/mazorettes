import {Observable} from 'rxjs';

export abstract class LoginService {

  public abstract sendCredentials(params: {login: string, pass: string}): Observable<void>

  public abstract isLogged(): Observable<boolean>
}
