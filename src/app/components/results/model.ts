import {Observable} from 'rxjs';
import {CategoriesResult} from '../../xlsx/xlsx.service';
import {DisciplineType} from '../../shared/model';
import {Group} from '../categories/model';

export enum Category {
  solo,
  duo,
  group
}
export interface Result {
  [K: number]: number
}

export interface RefereeNotes {
  [K: number]: string
}

export interface Assignee {
  ordNumber: number
  attendeeNote: string;
  choreography: Result
  difficulty: Result
  costumes: Result
  overall: Result
  facialExpression: Result
  music: Result
  faults: Result
  notes: RefereeNotes
  synchro: Result
  formationChange: Result
  categoryName: string
  categoryUuid: string
  resultBy: DisciplineType
  totalNumber: number
}

export interface AssigneeDTO {
  ordNumber: number
  choreography: Result
  difficulty: Result
  costumes: Result
  overall: Result
  facialExpression: Result
  music: Result
  faults: Result
  notes: RefereeNotes
  synchro: Result
  formationChange: Result
}

export abstract class ResultService {

  public abstract getResults$(): Observable<Assignee[]>

  public abstract checkResults(): void

  public abstract getGroups$(): Observable<Group[]>
}
