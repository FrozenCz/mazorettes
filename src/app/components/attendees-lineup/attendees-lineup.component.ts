import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent, MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {Attendee} from '../lineup/model';
import {AgGridAngular} from 'ag-grid-angular';
import {AsyncPipe, JsonPipe} from '@angular/common';
import {ColDef, GridApi, GridOptions, GridReadyEvent} from 'ag-grid-community';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-attendees-lineup',
  standalone: true,
  imports: [
    AgGridAngular,
    AsyncPipe,
    JsonPipe,
    MatButton,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './attendees-lineup.component.html',
  styleUrl: './attendees-lineup.component.scss'
})
export class AttendeesLineupComponent {

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
    },
    onRowSelected: (params) => {
    }
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { attendees: Attendee[], startNumber: string },
    public dialogRef: MatDialogRef<AttendeesLineupComponent>
  ) {
  }

  selectedRowEmit(grid: GridApi) {
    this.dialogRef.close(grid.getSelectedRows()[0].startNumber);
  }

  onGridReady($event: GridReadyEvent<any>) {
    const row = $event.api.getRowNode(this.data.startNumber);
    if (row) {
      row.setSelected(true);
      $event.api.ensureNodeVisible(row, 'middle');
    }
  }
}
