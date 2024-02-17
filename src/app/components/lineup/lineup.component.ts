import {Component} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {Attendee, LineupService} from './model';
import {BehaviorSubject, Observable} from 'rxjs';
import {LineupServiceImpl} from './lineup.service';
import {AsyncPipe, JsonPipe, NgForOf} from '@angular/common';
import {ColDef, GridApi, GridOptions, GridReadyEvent} from 'ag-grid-community';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatOption} from '@angular/material/autocomplete';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import {NumberSelectorComponent} from '../number-selector/number-selector.component';
import {MatDialog} from '@angular/material/dialog';
import {MatInput} from '@angular/material/input';
import {Group} from '../categories/model';

@Component({
  selector: 'app-lineup',
  standalone: true,
  imports: [
    AgGridAngular,
    AsyncPipe,
    MatButton,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    MatInput,
    JsonPipe
  ],
  templateUrl: './lineup.component.html',
  styleUrl: './lineup.component.scss',
  providers: [{provide: LineupService, useClass: LineupServiceImpl}]
})
export class LineupComponent {
  attendees$: Observable<Attendee[]>
  colDefs: ColDef[] = [{
    field: 'startNumber',
    headerName: 'Startovní číslo'
  },
    {
      field: 'note',
      headerName: 'Soutěžící'
    },
    {
      field: 'group.name',
      headerName: 'Skupina'
    }
  ];
  gridOptions: GridOptions = {
    rowSelection: 'single',
    getRowId: (params) => params.data.startNumber,
    onRowClicked: (params) => {

      this.attendeeNumber$.next(params.data.startNumber)

    }
  };
  selectedGroup: Group | undefined = undefined
  groups$: Observable<Group[]>
  attendeeNumber$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private gridApi: GridApi<any> | undefined;

  constructor(private service: LineupService, private matDialog: MatDialog) {
    this.attendees$ = service.getAttendees$()
    this.groups$ = service.getGroups$();
  }


  onGridReady($event: GridReadyEvent<any>) {
    this.gridApi = $event.api;
  }


  showNumber(currentNumber: number) {
    const dialogRef = this.matDialog.open(NumberSelectorComponent, {data: {currentNumber}})

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.attendeeNumber$.next(result)
        this.scrollToRow(result);
      }
    })
  }

  onGroupChanged($event: MatSelectChange) {
    const selectedType = ($event.value as Group)
    this.selectedGroup = selectedType;
  }

  scrollToRow(attendeeStartNumber: number): void {
    const row = this.gridApi?.getRowNode(attendeeStartNumber.toString());
    if (row) {
      row.setSelected(true, true)
      this.gridApi?.ensureNodeVisible(row, 'middle');
    } else {
      this.gridApi?.deselectAll();
    }
  }

  changeAttendeeNumber(number: number) {
    this.attendeeNumber$.next(number);
    this.scrollToRow(number)
  }
}
