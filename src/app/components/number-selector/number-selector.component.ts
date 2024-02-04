import {Component, Inject, OnInit} from '@angular/core';
import {MatCard, MatCardContent} from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {NgForOf} from '@angular/common';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-number-selector',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatDialogContent,
    NgForOf,
    MatButton,
    MatDialogActions,
    MatFabButton,
    MatDialogTitle,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './number-selector.component.html',
  styleUrl: './number-selector.component.scss'
})
export class NumberSelectorComponent{
  numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  number = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { currentNumber: number },
    public dialogRef: MatDialogRef<NumberSelectorComponent>) {
    this.number = data.currentNumber + '';
  }

  close() {
    this.dialogRef.close(+this.number);
  }

  addNumber(i: number) {
    this.number += i;
  }

}
