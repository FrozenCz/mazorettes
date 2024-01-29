import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {loginGuardGuard} from './guards/login-guard.guard';
import {ResultsComponent} from './components/results/results.component';

export const routes: Routes = [
  {path: '', pathMatch: 'full', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [loginGuardGuard]},
  {path: 'results', component: ResultsComponent},
];
