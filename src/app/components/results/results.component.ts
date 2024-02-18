import {Component} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {ColDef, GridOptions, GridReadyEvent, GridApi, ColumnApi} from 'ag-grid-community';
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import {BehaviorSubject, combineLatest, map, Observable, ReplaySubject, switchMap, tap, timer} from 'rxjs';
import {Assignee, Category, ResultService} from './model';
import {ResultsServiceImpl} from './results.service';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatIcon} from '@angular/material/icon';
import {XlsxService} from '../../xlsx/xlsx.service';
import {MatFormField, MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Group} from '../categories/model';
import {MatOption, MatSelect} from '@angular/material/select';
import {AG_GRID_LOCALE_CS} from '../../locale.cs';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [AgGridAngular, AsyncPipe, JsonPipe, MatButton, MatButtonToggle, MatButtonToggleGroup, MatIconButton, MatIcon, NgIf, MatInput, FormsModule, NgForOf, MatSelect, MatOption, MatFormField],
  providers: [{provide: ResultService, useClass: ResultsServiceImpl}],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  protected readonly Category = Category;
  showAllColumns = false;
  filter$: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined);
  refresh$: ReplaySubject<void> = new ReplaySubject<void>(1);

  results$: Observable<Assignee[]>;
  gridOptions: GridOptions = {
    localeText: AG_GRID_LOCALE_CS,
    getRowId: ({data}) => data.ordNumber,
    includeHiddenColumnsInQuickFilter: false,
  };
  private gridApi: GridApi | undefined;
  private columnApi: ColumnApi | undefined;
  defColDef: ColDef = {
    cellRenderer: this.showRefereeRenderer,
    sortable: false,
    suppressMovable: true,
    floatingFilter: true,
    filter: 'agTextColumnFilter'
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
    {
      colId: 'attendeeNote',
      field: 'attendeeNote',
      flex: 1,
      headerName: 'Účastníci',
      cellRenderer: (params: any) => params.value
    },
    {colId: 'category', field: 'categoryName', headerName: 'Kategorie', cellRenderer: (p: any) => p.value},
    {colId: 'resultBy', field: 'resultBy', headerName: 'Hodnoceno podle', cellRenderer: (p: any) => p.value},
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
      filter: 'agNumberColumnFilter',
      headerName: 'Celkový počet',
      cellRenderer: (params: any) => params.value,
      sort: 'desc'
    },
    {colId: 'notes', field: 'notes', headerName: 'Poznámky', cellClass: 'note', hide: true},
  ];
  searchValue: string = '';
  menus: Group[] = [];
  showSnack: boolean = false;


  constructor(private resultService: ResultService, private xlsx: XlsxService, private snackBar: MatSnackBar) {
    this.results$ = this.refresh$.pipe(switchMap(() => combineLatest([resultService.getResults$(), this.filter$, resultService.getGroups$()]).pipe(
      map(([results, filter, groups]) => {
        this.menus = groups;
        if (filter === undefined) {
          return results;
        }
        return results.filter(r => filter === r.categoryUuid)
      }),
      tap(() => {
        if (this.gridApi) {
          this.gridApi.redrawRows();
          if (this.showSnack) {
            this.snackBar.open('Hotovo', undefined, {duration: 2000})
            this.showSnack = false;
          }
        }
      })))
    );

    this.refresh$.next();
    timer(60000, 60000).subscribe(() => {
      this.refresh$.next();
    })
  }


  private showRefereeRenderer(params: any): string {
    let result = '';

    let prop: keyof typeof params.value;
    for (prop in params.value) {
      result += (result.length > 0 ? ', ' : '') + '<span class="refereeNum">' + prop + ':</span><b>' + params.value[prop] + '</b>'
    }
    return result;
  }

  setFilter(param: string | undefined) {
    if (param === 'Vše') {
      this.filter$.next(undefined);
    } else {
      this.filter$.next(param);
    }
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

  downloadData() {
    this.showSnack = true;
    this.refresh$.next();
  }
}
