import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo';
import { GestionInventarioComponent } from './components/gestion-inventario/gestion-inventario';
import { RegistroComponent } from './components/registro/registro';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'gestion', component: GestionInventarioComponent }, // Sin Guard
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'catalogo' }
];