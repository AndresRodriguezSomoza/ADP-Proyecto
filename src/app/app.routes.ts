import { Routes } from '@angular/router';
import { PaginaPrincipalComponent } from './pagina-principal/pagina-principal';

export const routes: Routes = [
  { path: '', component: PaginaPrincipalComponent },
  { path: 'inicio', component: PaginaPrincipalComponent }
];