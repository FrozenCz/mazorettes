import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {NgForOf} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';


@Component({
  selector: 'app-result-input',
  standalone: true,
  imports: [
    MatButtonToggle,
    MatButtonToggleGroup,
    NgForOf,
    MatFormField,
    MatLabel
  ],
  templateUrl: './result-input.component.html',
  styleUrl: './result-input.component.scss'
})
export class ResultInputComponent implements OnChanges {

  @Input() toNumber: number = 0;
  @Input() inputName: string = '';
  @Output() selectedButton: EventEmitter<number | undefined> = new EventEmitter<number | undefined>();
  numbers: number[] = [];


  onButtonChange($event: MatButtonToggleChange) {
    this.selectedButton.emit($event.value);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const toNumber = changes['toNumber'].currentValue;
    if (changes && toNumber !== undefined) {
      this.numbers = [];
      for (let i = 0; i <= toNumber; i++) {
        this.numbers.push(i);
      }
    }
  }
}
