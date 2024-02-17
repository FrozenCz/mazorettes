import {Component} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect, MatSelectChange} from '@angular/material/select';
import {CategoryDisciplineMap, DisciplineMap, DisciplineType, DisciplineTypes} from '../../shared/model';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatButton, MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {AgGridAngular} from 'ag-grid-angular';
import {ColDef, GridOptions, GridReadyEvent} from 'ag-grid-community';
import {firstValueFrom, noop, Observable} from 'rxjs';
import {CategoriesService, Group} from './model';
import {CategoriesServiceImpl} from './categories.service';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatSelect,
    MatLabel,
    MatOption,
    MatIcon,
    NgForOf,
    MatButton,
    FormsModule,
    AgGridAngular,
    AsyncPipe,
    NgIf,
    MatIconButton
  ],
  providers: [{provide: CategoriesService, useClass: CategoriesServiceImpl}],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  types = DisciplineTypes;
  selectedType: DisciplineType | undefined = undefined;
  editedCategoryNumber: undefined | string = undefined;
  categoryName = '';
  colDefs: ColDef[] = [{
    colId: 'name',
    field: 'name',
  }, {
    colId: 'resultBy',
    valueGetter: (params) => DisciplineMap.has(params.data.resultBy) ? DisciplineMap.get(params.data.resultBy) : 'skupina nenalezena'
  }];
  gridOptions: GridOptions = {
    rowSelection: 'single',
    onRowClicked: (params) => {
      this.editedCategoryNumber = params.data.uuid
      this.categoryName = params.data.name
      this.selectedType = DisciplineMap.get(params.data.resultBy)
    }
  };
  groups$: Observable<Group[]>;

  constructor(private service: CategoriesService) {
    this.groups$ = service.getGroups$();
  }

  onCategoryChanged($event: MatSelectChange) {
    this.selectedType = ($event.value as DisciplineType);
  }

  createGroup(selectedType: DisciplineType | undefined, name: string) {
    if (selectedType === undefined) {
      return;
    }
    const category = CategoryDisciplineMap.get(selectedType);
    if (category !== undefined) {
      firstValueFrom(this.service.createGroup({resultBy: category, name})).then(() => {

      }, reason => {
        console.log(reason);
      })
    }
  }

  saveGroup(selectedType: DisciplineType | undefined, name: string, uuid: string) {
    if (selectedType === undefined) {
      return;
    }
    const category = CategoryDisciplineMap.get(selectedType);
    if (category !== undefined) {
      firstValueFrom(this.service.saveGroup({resultBy: category, name, uuid})).then(() => {

      }, reason => {
        console.log(reason);
      })
    }
  }

  deleteGroup(): void {
    if (confirm('Opravdu chcete smazat skupinu ' + this.categoryName + '?') && this.editedCategoryNumber) {
      firstValueFrom(this.service.deleteGroup(this.editedCategoryNumber)).then(() => this.editedCategoryNumber = undefined)
    }
  }

  onGridReady($event: GridReadyEvent<any>) {

  }

}
