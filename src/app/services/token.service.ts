import {LoginService} from '../components/login/login.model';
import {BehaviorSubject, map, noop, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService implements LoginService {

  private isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient, private router: Router) {
    const localStorageToken = localStorage.getItem('authJwtToken');
    if (localStorageToken && this.isValid(localStorageToken)) {
      this.logIn(localStorageToken);
    }
  }

  sendCredentials(params: { login: string, pass: string }): Observable<void> {
    return this.httpClient.post<{ access_token: string }>('/api/auth/login', {
      name: params.login,
      pass: params.pass
    }).pipe(map(response => {
      if (response?.access_token) {
        this.logIn(response?.access_token)
      }
      return;
    }));
  }

  private logIn(token: string): void {
    localStorage.setItem('authJwtToken', token);
    this.isLogged$.next(true);
  }

  isLogged(): Observable<boolean> {
    return this.isLogged$.asObservable();
  }

  private isValid(access_token: string | undefined): boolean {
    if (!access_token) {
      return false;
    }
    const date = jwtDecode(access_token.toString()).exp;
    return !!date && (new Date( date * 1000) > new Date());
  }

  public static hasValidToken(): boolean {
    const localStorageToken = localStorage.getItem('authJwtToken');

    if (!localStorageToken) {
      return false;
    }

    const date = jwtDecode(localStorageToken.toString()).exp;
    return !!date && (new Date( date * 1000) > new Date());
  }

  logout() {
    localStorage.removeItem('authJwtToken');
    this.isLogged$.next(false);
    this.router.navigate(['/']).then(noop)
  }
}
