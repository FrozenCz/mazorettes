import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {MatToolbar, MatToolbarRow} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {TokenService} from './services/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatToolbarRow, MatIcon, MatIconButton],
  providers: [TokenService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'mazorettes';

  constructor(private tokenService: TokenService) {
  }
  logout() {
    if (confirm('Opravdu se chcete odhlásit z aplikace?')) {
      this.tokenService.logout();
    }
  }
}
