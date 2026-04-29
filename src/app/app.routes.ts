import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { DashboardComponent } from './dashboard.component';
import { LoginComponent } from './login.component';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'login' },
	{ path: 'login', component: LoginComponent },
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [authGuard],
	},
	{ path: '**', redirectTo: 'login' },
];
