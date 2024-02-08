import {Component} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {ColDef} from 'ag-grid-community';
import {AsyncPipe, JsonPipe, NgIf} from '@angular/common';
import {BehaviorSubject, combineLatest, firstValueFrom, map, Observable} from 'rxjs';
import {Assignee, Category, ResultCategory, ResultService} from './model';
import {ResultsServiceImpl} from './results.service';
import {DisciplineMap} from '../../shared/model';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatIcon} from '@angular/material/icon';
import {XlsxService} from '../../xlsx/xlsx.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [AgGridAngular, AsyncPipe, JsonPipe, MatButton, MatButtonToggle, MatButtonToggleGroup, MatIconButton, MatIcon, NgIf],
  providers: [{provide: ResultService, useClass: ResultsServiceImpl}],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {

  filter$: BehaviorSubject<Category | undefined> = new BehaviorSubject<Category | undefined>(undefined);

  results$: Observable<Assignee[]>;
  defColDef: ColDef = {
    cellRenderer: this.showRefereeRenderer
  }
  colDefs: ColDef[] = [
    {colId: 'ordNumber', field: 'ordNumber', headerName: 'Startovní číslo', cellRenderer: (params: any) => params.value},
    {colId: 'category', field: 'category', headerName: 'Kategorie', cellRenderer: this.categoryRenderer},
    {colId: 'choreography', field: 'choreography', headerName: 'Choreografie'},
    {colId: 'difficulty', field: 'difficulty', headerName: 'Obtížnostm práce s náčinním'},
    {colId: 'costumes', field: 'costumes', headerName: 'Vhodnost kostýmu, líčení'},
    {colId: 'overall', field: 'overall', headerName: 'Celkový dojem'},
    {colId: 'facialExpression', field: 'facialExpression', headerName: 'Výraz soutěžících'},
    {colId: 'music', field: 'music', headerName: 'Hudba'},
    {colId: 'faults', field: 'faults', headerName: 'Četnost pádu náčiní'},
    {colId: 'synchro', field: 'synchro', headerName: 'Synchronizace'},
    {colId: 'formationChange', field: 'formationChange', headerName: 'Využití , střídání obrazců'},
    {colId: 'notes', field: 'notes', headerName: 'Poznámky', cellClass: 'note'},
  ];

  constructor(private resultService: ResultService, private xlsx: XlsxService) {
    this.results$ = combineLatest([resultService.getResults$(), this.filter$]).pipe(map(([results, filter]) => {
      if(!filter) {
        return results;
      }
      return results.filter(r => this.categoryExists(r.category, filter))
    }));
  }

  private showRefereeRenderer(params: any): string {
    let result = '';

    let prop: keyof typeof params.value;
    for (prop in params.value) {
      result += (result.length > 0 ? ', ' : '')+ '<span class="refereeNum">'+prop + ':</span><b>' + params.value[prop] + '</b>'
    }
    return result;
  }

  private categoryExists(categoryObject: ResultCategory, category: Category): boolean {
    return categoryObject[1] === category || categoryObject[2] === category || categoryObject[3] === category || categoryObject[4] === category
  }

  private categoryRenderer(params: any): string {
    let errorResult = '';
    let normalResult = '';
    let showErrorResult = false;

    let prop: keyof typeof params.value;
    for (prop in params.value) {
      const translatedCategory = DisciplineMap.get(params.value[prop])
      errorResult += (errorResult.length > 0 ? ', ' : '') + prop + ': ' + translatedCategory;

      if (normalResult.length === 0 && translatedCategory) {
        normalResult = translatedCategory;
      }

      if (normalResult.length > 0 && normalResult !== translatedCategory) {
        showErrorResult = true;
      }

    }
    return showErrorResult ? errorResult + ', kategorie urcena: ' + DisciplineMap.get(params.data.mainCategory) : normalResult;
  }

  setFilter(param: Category | undefined) {
    this.filter$.next(param);
  }

  printResults(results: Assignee[]) {
    this.xlsx.printResults(results);
  }

  protected readonly Category = Category;
}
