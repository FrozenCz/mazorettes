import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {TokenService} from './services/token.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatToolbarRow, MatIcon, MatIconButton, RouterLink, NgIf, AsyncPipe],
  providers: [TokenService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mazorettes';
  logged$: Observable<boolean>;
  showMenu: boolean = false;

  constructor(private tokenService: TokenService) {
    this.logged$ = tokenService.isLogged();
  }
  logout() {
    if (confirm('Opravdu se chcete odhlásit z aplikace?')) {
      this.tokenService.logout();
    }
  }
}
