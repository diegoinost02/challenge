import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/auth/auth.component').then(c => c.AuthComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./components/auth/login/login.component').then(c => c.LoginComponent),
            },
            {
                path: 'register',
                loadComponent: () => import('./components/auth/register/register.component').then(c => c.RegisterComponent),
            }
        ]
    },
    {
        path: 'app',
        loadComponent: () => import('./components/layout/layout.component').then(c => c.LayoutComponent),
        canActivate: [authGuard],
        children: [
            {
                path: '',
                loadComponent: () => import('./components/layout/components/main/main.component').then(c => c.MainComponent),
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
