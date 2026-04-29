import { Routes } from '@angular/router';
import { EditorInfo } from './components/editar-info/editar-info';
import { EditarImagenes } from './components/editar-imagenes/editar-imagenes';
import { EditarGrados } from './components/editar-grados/editar-grados';
import { EditarFooter } from './components/editar-footer/editar-footer';

export const routes: Routes = [
  { path: 'editar-info', component: EditorInfo },
  { path: 'editar-imagenes', component: EditarImagenes },
  { path: 'editar-grados', component: EditarGrados },
  { path: 'editar-footer', component: EditarFooter },
  { path: '', redirectTo: '/editar-info', pathMatch: 'full' },
];