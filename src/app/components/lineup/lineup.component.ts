import {Component} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {Attendee, LineupService} from './model';
import {BehaviorSubject, firstValueFrom, map, noop, Observable, take, tap, timer, withLatestFrom} from 'rxjs';
import {LineupServiceImpl} from './lineup.service';
import {AsyncPipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
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
import {FormsModule} from '@angular/forms';

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
    JsonPipe,
    NgIf,
    FormsModule
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

    },
    onRowSelected: (params) => {
      const data = this.gridApi?.getSelectedNodes()[0]?.data;
      if (data) {
        this.attendeeNumber$.next(data.startNumber);
        this.note = data.note;
        this.selectedGroup = this.groups.find(g => g.uuid === data.group.uuid);
      }
    }
  };
  selectedGroup: Group | undefined = undefined
  groups$: Observable<Group[]>
  groups: Group[] = [];
  attendeeNumber$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private gridApi: GridApi<any> | undefined;
  isEdit$: Observable<boolean>;
  note = '';

  constructor(private service: LineupService, private matDialog: MatDialog) {
    this.attendees$ = service.getAttendees$().pipe(tap(() => {
        timer(20).subscribe(() => {
          this.scrollToRow(this.attendeeNumber$.getValue());
        })
    }))
    this.groups$ = service.getGroups$().pipe(tap(groups => this.groups = groups));
    this.isEdit$ = this.attendeeNumber$.pipe(withLatestFrom(this.attendees$)).pipe(map(([number, attendees]) => attendees.some(a => a.startNumber === number)))
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
      this.note = '';
    }
  }

  changeAttendeeNumber(number: number) {
    this.attendeeNumber$.next(number);
    this.scrollToRow(number)
  }

  save(): void {
    if (this.selectedGroup) {
      firstValueFrom(this.service.saveAttendee({
        startNumber: this.attendeeNumber$.getValue(),
        groupUuid: this.selectedGroup.uuid,
        note: this.note
      })).then(() => {
      }).catch(e => console.log(e))
    }
  }

  delete() {
    const startNumber = this.attendeeNumber$.getValue();
    if(confirm('Opravdu chcete smazat startovní číslo ' + startNumber + '?') && startNumber !== undefined) {
      firstValueFrom(this.service.deleteAttendee(startNumber)).then(noop)
    }
  }
}
