import {Component} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {NgForOf} from '@angular/common';
import {ResultInputComponent} from '../result-input/result-input.component';
import {MatFormField, MatOption, MatSelect} from '@angular/material/select';
import {MatLabel} from '@angular/material/form-field';
import {MatDialog} from '@angular/material/dialog';
import {NumberSelectorComponent} from '../number-selector/number-selector.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-referee-form',
  standalone: true,
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
    NgForOf,
    ResultInputComponent,
    MatSelect,
    MatFormField,
    MatOption,
    MatLabel,
    MatButton,
    MatIconButton,
    MatIcon,
    MatInput
  ],
  templateUrl: './referee-form.component.html',
  styleUrl: './referee-form.component.scss'
})
export class RefereeFormComponent {
  numbers = [0,1,2,3,4,5,6,7,8,9];
  attendeeNumber: number = 0;
  types = ['Solo', 'Duo', 'Trio', 'Skupina'];

  constructor(private matDialog: MatDialog) {
  }
  showNumber(currentNumber: number) {
    const dialogRef = this.matDialog.open(NumberSelectorComponent, {data: {currentNumber}})

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        this.attendeeNumber = result;
      }
    })
  }
}
