import {Category} from '../components/results/model';

export const RefereeNumbers = [0, 1, 2, 3, 4];

export type DisciplineType =  'Solo' | 'Duo' | 'Skupina'
export const DisciplineTypes: DisciplineType[] = ['Solo', 'Duo', 'Skupina']

export const CategoryDisciplineMap: Map<DisciplineType, Category> = new Map<DisciplineType, Category>([
  ['Solo', 0],
  ['Duo', 1],
  ['Skupina', 2],
])

export const DisciplineMap: Map<Category, DisciplineType> = new Map<Category, DisciplineType>([
  [0, 'Solo'],
  [1, 'Duo'],
  [2, 'Skupina'],
])

export interface Criteria {
  name: string
  toNumber: number
  selectedResult: number | undefined
}

export const SharedCriteria: Criteria[] = [
  {name: 'Choreografie', selectedResult: undefined, toNumber: 5},
  {name: 'Obtížnost', selectedResult: undefined, toNumber: 5},
  {name: 'Vhodnost kostýmu, líčení', selectedResult: undefined, toNumber: 5},
  {name: 'Celkový dojem', selectedResult: undefined, toNumber: 5},
  {name: 'Výraz soutěžících', selectedResult: undefined, toNumber: 5},
  {name: 'Hudba', selectedResult: undefined, toNumber: 5},
  {name: 'Četnost pádu náčiní', selectedResult: undefined, toNumber: 5},
];



