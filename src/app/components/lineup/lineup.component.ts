import { Component } from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {Attendee, LineupService} from './model';
import {Observable} from 'rxjs';
import {LineupServiceImpl} from './lineup.service';
import {AsyncPipe, NgForOf} from '@angular/common';
import {ColDef, GridOptions, GridReadyEvent} from 'ag-grid-community';
import {DisciplineType, DisciplineTypes} from '../../shared/model';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatOption} from '@angular/material/autocomplete';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import {NumberSelectorComponent} from '../number-selector/number-selector.component';
import {MatDialog} from '@angular/material/dialog';
import {MatInput} from '@angular/material/input';

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
    MatInput
  ],
  templateUrl: './lineup.component.html',
  styleUrl: './lineup.component.scss',
  providers: [{provide: LineupService, useClass: LineupServiceImpl}]
})
export class LineupComponent {
  attendees$: Observable<Attendee[]>
  colDefs: ColDef[] = [];
  gridOptions: GridOptions = {};
  selectedType: DisciplineType | undefined = undefined;
  types = DisciplineTypes;
  attendeeNumber: number = 1;

  constructor(private service: LineupService, private matDialog: MatDialog) {
    this.attendees$ = service.getAttendees$()
  }


  onGridReady($event: GridReadyEvent<any>) {

  }


  showNumber(currentNumber: number) {
    const dialogRef = this.matDialog.open(NumberSelectorComponent, {data: {currentNumber}})

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.attendeeNumber = result;
      }
    })
  }

  onCategoryChanged($event: MatSelectChange) {
    const selectedType = ($event.value as DisciplineType)
    this.selectedType = selectedType;
  }
}
