import {Component} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {ColDef, GridOptions, GridReadyEvent, GridApi, ColumnApi} from 'ag-grid-community';
import {AsyncPipe, JsonPipe, NgIf} from '@angular/common';
import {BehaviorSubject, combineLatest, map, Observable, tap} from 'rxjs';
import {Assignee, Category, ResultCategory, ResultService} from './model';
import {ResultsServiceImpl} from './results.service';
import {DisciplineMap} from '../../shared/model';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatIcon} from '@angular/material/icon';
import {XlsxService} from '../../xlsx/xlsx.service';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [AgGridAngular, AsyncPipe, JsonPipe, MatButton, MatButtonToggle, MatButtonToggleGroup, MatIconButton, MatIcon, NgIf, MatInput, FormsModule],
  providers: [{provide: ResultService, useClass: ResultsServiceImpl}],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  protected readonly Category = Category;
  showAllColumns = false;
  filter$: BehaviorSubject<Category | undefined> = new BehaviorSubject<Category | undefined>(undefined);

  results$: Observable<Assignee[]>;
  gridOptions: GridOptions = {
    getRowId: ({data}) => data.ordNumber,
    includeHiddenColumnsInQuickFilter: false,
  };
  private gridApi: GridApi | undefined;
  private columnApi: ColumnApi | undefined;
  defColDef: ColDef = {
    cellRenderer: this.showRefereeRenderer,
    sortable: false,
    suppressMovable: true
  }
  colDefs: ColDef[] = [
    {
      colId: 'ord',
      headerName: 'Pozice',
      cellRenderer: (params: any) => params.node.rowIndex + 1
    },
    {
      colId: 'ordNumber',
      field: 'ordNumber',
      headerName: 'Startovní číslo',
      cellRenderer: (params: any) => params.value
    },
    {colId: 'category', field: 'category', headerName: 'Kategorie', cellRenderer: this.categoryRenderer},
    {colId: 'choreography', field: 'choreography', headerName: 'Choreografie', hide: true},
    {colId: 'difficulty', field: 'difficulty', headerName: 'Obtížnostm práce s náčinním', hide: true},
    {colId: 'costumes', field: 'costumes', headerName: 'Vhodnost kostýmu, líčení', hide: true},
    {colId: 'overall', field: 'overall', headerName: 'Celkový dojem', hide: true},
    {colId: 'facialExpression', field: 'facialExpression', headerName: 'Výraz soutěžících', hide: true},
    {colId: 'music', field: 'music', headerName: 'Hudba', hide: true},
    {colId: 'faults', field: 'faults', headerName: 'Četnost pádu náčiní', hide: true},
    {colId: 'synchro', field: 'synchro', headerName: 'Synchronizace', hide: true},
    {colId: 'formationChange', field: 'formationChange', headerName: 'Využití , střídání obrazců', hide: true},
    {
      colId: 'totalNumber',
      field: 'totalNumber',
      headerName: 'Celkový počet',
      cellRenderer: (params: any) => params.value,
      sort: 'desc'
    },
    {colId: 'notes', field: 'notes', headerName: 'Poznámky', cellClass: 'note', hide: true},
  ];
  searchValue: string = '';


  constructor(private resultService: ResultService, private xlsx: XlsxService) {
    this.results$ = combineLatest([resultService.getResults$(), this.filter$]).pipe(
      map(([results, filter]) => {
        if (filter === undefined) {
          return results;
        }
        return results.filter(r => filter === r.mainCategory)
      }),
      tap(() => {
        if (this.gridApi) {
          this.gridApi.redrawRows();
        }
      })
    );
  }

  private showRefereeRenderer(params: any): string {
    let result = '';

    let prop: keyof typeof params.value;
    for (prop in params.value) {
      result += (result.length > 0 ? ', ' : '') + '<span class="refereeNum">' + prop + ':</span><b>' + params.value[prop] + '</b>'
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
    return showErrorResult ? errorResult + ', kategorie určená: ' + DisciplineMap.get(params.data.mainCategory) : normalResult;
  }

  setFilter(param: Category | undefined) {
    this.filter$.next(param);
  }

  printResults(results: Assignee[]) {
    this.xlsx.printResults(results);
  }


  onGridReady($event: GridReadyEvent<any>) {
    this.gridApi = $event.api;
    this.columnApi = $event.columnApi;
  }

  switchColumns(): void {
    if (!this.gridApi || !this.columnApi) return

    this.showAllColumns = !this.showAllColumns;

    this.columnApi.setColumnsVisible(['notes', 'formationChange', 'synchro', 'faults', 'music', 'facialExpression', 'overall', 'costumes', 'difficulty', 'choreography'], this.showAllColumns);

  }

}
