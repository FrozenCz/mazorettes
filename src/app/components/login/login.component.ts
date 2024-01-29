import {Component} from '@angular/core';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {LoginService} from './login.model';
import {TokenService} from '../../services/token.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '@auth0/auth0-angular';
import {firstValueFrom, noop, Observable, tap} from 'rxjs';
import {AsyncPipe, NgIf} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatButton,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    MatLabel
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [{provide: LoginService, useExisting: TokenService}, AuthService]
})
export class LoginComponent {
  loginForm: FormGroup;
  isAuthenticated$: Observable<boolean>;

  constructor(private loginService: LoginService, private fb: FormBuilder, private snackBar: MatSnackBar, private router: Router) {
    this.loginForm = fb.group({
      login: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.isAuthenticated$ = this.loginService.isLogged().pipe(tap((logged) => {
      if (logged) {
        this.router.navigate(['/home']).then(noop);
      }
    }));
  }

  sendLogin(loginForm: FormGroup) {
    firstValueFrom(this.loginService.sendCredentials({
      login: loginForm.get('login')!.value,
      pass: loginForm.get('password')!.value
    })).then(() => {
      this.snackBar.open('Přihlášen', '', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: 'snackbar-success',
        duration: 2000
      })
    }).catch(() => {
      this.snackBar.open('Nepřihlášen', '', {
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: 'snackbar-danger',
        duration: 2000
      })
    })
  }
}
