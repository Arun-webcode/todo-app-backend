import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { loginGuard } from './auth/login.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'signup',
    canActivate: [loginGuard],
    loadComponent: () => import('./auth/signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: 'reset-password',
    canActivate: [loginGuard],
    loadComponent: () => import('./auth/reset-password/reset-password.page').then(m => m.ResetPasswordPage)
  }
];
