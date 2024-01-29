import {LoginService} from '../components/login/login.model';
import {BehaviorSubject, map, noop, Observable, switchMap} from 'rxjs';
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
    if (localStorageToken && TokenService.isValid(localStorageToken)) {
      this.setToken(localStorageToken);
    }
  }

  sendCredentials(params: { login: string, pass: string }): Observable<void> {
    return this.httpClient.post<{ access_token: string }>('/api/auth/login', {
      name: params.login,
      pass: params.pass
    }).pipe(map(response => {
      if (response?.access_token) {
        this.setToken(response?.access_token)
      }
      return;
    }));
  }

  setToken(token: string): void {
    localStorage.setItem('authJwtToken', token);
    this.isLogged$.next(true);
  }

  isLogged(): Observable<boolean> {
    return this.isLogged$.asObservable();
  }

  public static isValid(access_token: string | undefined): boolean {
    if (!access_token) {
      return false;
    }
    const date = jwtDecode(access_token.toString()).exp;
    return !!date && (new Date(date * 1000) > new Date());
  }

  public static hasValidToken(): boolean {
    const localStorageToken = localStorage.getItem('authJwtToken');

    if (!localStorageToken) {
      return false;
    }

    const date = jwtDecode(localStorageToken.toString()).exp;
    return !!date && (new Date(date * 1000) > new Date());
  }

  logout() {
    localStorage.removeItem('authJwtToken');
    this.isLogged$.next(false);
    this.router.navigate(['/']).then(noop)
  }

  getToken(): Observable<{ refereeNumber: number | undefined }> {
    return this.isLogged$.pipe(map((logged) => {

      if (!logged) {
        return {refereeNumber: undefined}
      }

      const localStorageToken = localStorage.getItem('authJwtToken');
      if (localStorageToken) {
        return {
          refereeNumber: (jwtDecode(localStorageToken.toString()) as {
            refereeNumber: number | undefined
          }).refereeNumber
        }
      }

      return {refereeNumber: undefined}
    }));
  }
}
