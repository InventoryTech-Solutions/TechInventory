import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo';
import { GestionInventarioComponent } from './components/gestion-inventario/gestion-inventario';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'gestion', component: GestionInventarioComponent }, // Sin Guard
  { path: '**', redirectTo: 'catalogo' }
];