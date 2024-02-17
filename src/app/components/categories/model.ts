import {Category} from '../results/model';
import {Observable} from 'rxjs';


export abstract class CategoriesService {

  abstract getGroups$(): Observable<Group[]>

  abstract createGroup(params: {name: string, resultBy: Category}): Observable<void>

  abstract saveGroup(params: {uuid: string, name: string, resultBy: Category}): Observable<void>

  abstract deleteGroup(uuid: string): Observable<void>

}
export interface Group {
  uuid: string
  name: string
  resultBy: Category
}
