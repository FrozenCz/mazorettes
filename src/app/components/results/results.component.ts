import { Component } from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {Assignee, ResultService} from './model';
import {ResultsServiceImpl} from './results.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [AgGridAngular, AsyncPipe],
  providers: [{provide: ResultService, useClass: ResultsServiceImpl}],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss'
})
export class ResultsComponent {
  results$: Observable<Assignee[]>;

  constructor(private resultService: ResultService) {
    this.results$ = resultService.getResults$();
  }

}
