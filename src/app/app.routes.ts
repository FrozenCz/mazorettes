import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {HomeComponent} from './components/home/home.component';
import {loginGuard, mainAccount} from './guards/login.guard';
import {ResultsComponent} from './components/results/results.component';
import {LineupComponent} from './components/lineup/lineup.component';
import {CategoriesComponent} from './components/categories/categories.component';

export const routes: Routes = [
  {path: '', pathMatch: 'full', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [loginGuard]},
  {path: 'results', component: ResultsComponent},
  {path: 'lineup', component: LineupComponent, canActivate: [mainAccount]},
  {path: 'categories', component: CategoriesComponent, canActivate: [mainAccount]}
];
