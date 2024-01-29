import {Component} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {RefereeNumbers} from '../../shared/model';
import {HomeService} from './model';
import {HomeServiceImpl} from './home.service';
import {firstValueFrom, Observable} from 'rxjs';
import {RefereeFormComponent} from '../referee-form/referee-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButton, MatIcon, RouterLink, NgIf, NgForOf, AsyncPipe, RefereeFormComponent
  ],
  providers: [{provide: HomeService, useClass: HomeServiceImpl}],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  selectedRefereeNumber$: Observable<boolean>;
  refereeNumbers = RefereeNumbers;

  constructor(private homeService: HomeService) {
    this.selectedRefereeNumber$ = homeService.isRefereeNumberSelected$();
  }

  async onRefereeSelected(referee: number) {
    try {
      await firstValueFrom(this.homeService.setRefereeNumber(referee))
    } catch (e) {
      console.log(e);
    }
  }
}
