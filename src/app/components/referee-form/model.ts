import {Category} from '../results/model';

export interface Result {
  choreography: undefined | number,
  difficulty: undefined | number,
  costumes: undefined | number,
  overall: undefined | number,
  facialExpression: undefined | number,
  music: undefined | number,
  faults: undefined | number,
  synchro: undefined | number,
  formationChange: undefined | number
}

export interface ResultDTO {
  ordNumber: number;
  category: Category;
  choreography: number,
  difficulty: number,
  costumes: number,
  overall: number,
  facialExpression: number,
  music: number,
  faults: number,
  synchro: number,
  formationChange: number
  note: string;
}
