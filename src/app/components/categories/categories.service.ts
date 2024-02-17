import {Injectable} from '@angular/core';
import {CategoriesService, Group} from './model';
import {Observable, ReplaySubject, Subject, switchMap, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {restIp} from '../../../environments/environment';
import {Category} from '../results/model';


@Injectable({providedIn: 'root'})
export class CategoriesServiceImpl implements CategoriesService {
  private refresh$: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(private httpClient: HttpClient) {
    this.refresh$.next();
  }

  getGroups$(): Observable<Group[]> {
    return this.refresh$.asObservable().pipe(switchMap(() => this.httpClient.get<Group[]>(restIp + '/groups')));
  }

  createGroup(params: { name: string; resultBy: Category }): Observable<void> {
    return this.httpClient.post<void>(restIp + '/groups', params).pipe(tap(() => this.refresh$.next()));
  }

  saveGroup(params: { uuid: string; name: string; resultBy: Category }): Observable<void> {
    return this.httpClient.put<void>(restIp + '/groups/' + params.uuid, params).pipe(tap(() => this.refresh$.next()));
  }

  deleteGroup(uuid: string): Observable<void> {
    return this.httpClient.delete<void>(restIp + '/groups/' + uuid).pipe(tap(() => this.refresh$.next()));
  }


}
