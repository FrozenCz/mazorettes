import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {TokenService} from './services/token.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {map, Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatToolbarRow, MatIcon, MatIconButton, RouterLink, NgIf, AsyncPipe, MatButton, RouterLinkActive],
  providers: [TokenService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mazorettes';
  logged$: Observable<boolean>;
  showMenu: boolean = false;
  refereeSelected$: Observable<boolean>;

  constructor(private tokenService: TokenService) {
    this.logged$ = tokenService.isLogged();
    this.refereeSelected$ = tokenService.getToken().pipe(map(token => token.refereeNumber !== undefined))
  }
  logout() {
    if (confirm('Opravdu se chcete odhlásit z aplikace?')) {
      this.tokenService.logout();
    }
  }
}
