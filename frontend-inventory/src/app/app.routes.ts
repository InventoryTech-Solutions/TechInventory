import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo';
import { GestionInventarioComponent } from './components/gestion-inventario/gestion-inventario';

export const routes: Routes = [
  { path: '', component: CatalogoComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'gestion', component: GestionInventarioComponent },
  { path: '**', redirectTo: '' }
];