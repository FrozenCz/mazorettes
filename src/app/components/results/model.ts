import {Observable} from 'rxjs';

export enum Category {
  solo,
  duo,
  trio,
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
  category: Category
  choreography: Result
  difficulty: Result
  costumes: Result
  overall: Result
  facialExpression: Result
  music: Result
  faults: Result
  notes: RefereeNotes
  synchro: Result | undefined
  formationChange: Result | undefined
}

export abstract class ResultService {

  public abstract getResults$(): Observable<Assignee[]>

  public abstract checkResults(): void

}
