import {Component} from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {NgForOf, NgIf} from '@angular/common';
import {ResultInputComponent} from '../result-input/result-input.component';
import {MatFormField, MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {MatLabel} from '@angular/material/form-field';
import {MatDialog} from '@angular/material/dialog';
import {NumberSelectorComponent} from '../number-selector/number-selector.component';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {CategoryDisciplineMap, DisciplineType, DisciplineTypes} from '../../shared/model';
import {Result} from './model';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RefereeFormService} from './referee-form.service';
import {firstValueFrom} from 'rxjs';
import {FormsModule} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

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
    MatInput,
    NgIf,
    MatProgressBar,
    FormsModule
  ],
  templateUrl: './referee-form.component.html',
  styleUrl: './referee-form.component.scss'
})
export class RefereeFormComponent {
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  attendeeNumber: number = 1;
  types = DisciplineTypes;
  selectedType: DisciplineType | undefined = undefined;
  toNumber: 5 | 10 = 5;
  result: Result
  totalNumber: number = 0;
  valid: boolean = false;
  sendingResult = false;
  note: string = ''

  constructor(private matDialog: MatDialog, private service: RefereeFormService, private snackBar: MatSnackBar) {
    this.result = this.getDefaultValues();
  }

  getDefaultValues(): Result {
    return {
      choreography: undefined,
      difficulty: undefined,
      costumes: undefined,
      overall: undefined,
      facialExpression: undefined,
      music: undefined,
      faults: undefined,
      synchro: undefined,
      formationChange: undefined
    };
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
    this.prefillCategoryDependency(selectedType);
    this.selectedType = selectedType;
    this.toNumber = (selectedType === 'Skupina') ? 10 : 5;
  }

  private prefillCategoryDependency(disciplineType: DisciplineType): void {
    switch (disciplineType) {
      case 'Solo':
        this.result.formationChange = 0;
        this.result.synchro = 0;
        break;
      case 'Duo':
        this.result.formationChange = 0;
        this.result.synchro = this.selectedType !== 'Solo' ? this.result.synchro ?? undefined : undefined
        break;
      case 'Skupina':
        this.result.formationChange = undefined;
        this.result.synchro = this.selectedType !== 'Solo' ? this.result.synchro ?? undefined : undefined
        break;
    }
    this.recalculate();
  }

  recalculate() {
    this.totalNumber = 0;
    this.valid = true;
    let prop: keyof typeof this.result;
    for (prop in this.result) {
      const categoryResult = this.result[prop];
      this.totalNumber = this.totalNumber + (categoryResult ?? 0)
      if (categoryResult === undefined) {
        this.valid = false;
      }
    }
  }

  sendResult() {
    this.sendingResult = true;

    firstValueFrom(this.service.sendResults({
      ordNumber: this.attendeeNumber,
      category: this.selectedType ? CategoryDisciplineMap.get(this.selectedType) ?? 0 : 0,
      costumes: this.result.costumes ?? 0,
      choreography: this.result.choreography ?? 0,
      formationChange: this.result.formationChange ?? 0,
      music: this.result.music ?? 0,
      facialExpression: this.result.facialExpression ?? 0,
      difficulty: this.result.difficulty ?? 0,
      faults: this.result.faults ?? 0,
      overall: this.result.overall ?? 0,
      synchro: this.result.synchro ?? 0,
      note: this.note
    })).then(() => {
      this.snackBar.open(`Hodnocení účastníka ${this.attendeeNumber} úspěšně odesláno. Obdržel od Vás ${this.totalNumber} bodů.`, undefined,{duration: 5000});
      this.result = {...this.getDefaultValues()}
      this.note = '';
      if (this.selectedType) {
        this.prefillCategoryDependency(this.selectedType);
      }
      this.attendeeNumber++;
      this.sendingResult = false;
    }).catch(() => {
      this.sendingResult = false;
    })

  }
}
