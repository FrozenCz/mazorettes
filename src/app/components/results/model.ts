import {Observable} from 'rxjs';

export enum Category {
  solo,
  duo,
  trio,
  group
}

export interface ResultCategory {
  [K: number]: Category
}
export interface Result {
  [K: number]: number
}

export interface RefereeNotes {
  [K: number]: string
}

export interface Assignee {
  ordNumber: number
  category: ResultCategory
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
  mainCategory: Category
  totalNumber: number
}

export interface AssigneeDTO {
  ordNumber: number
  category: ResultCategory
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
  mainCategory: Category
}

export abstract class ResultService {

  public abstract getResults$(): Observable<Assignee[]>

  public abstract checkResults(): void

}
