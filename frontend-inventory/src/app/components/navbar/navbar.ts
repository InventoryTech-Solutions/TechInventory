import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav style="display: flex; justify-content: space-between; padding: 1rem; background: #1e293b; color: white;">
      <h2>TechInventory</h2>
      <div>
        <span *ngIf="usuario" style="margin-right: 1rem;">Hola, {{ usuario.name }}</span>
        <button *ngIf="!usuario" (click)="login()" style="padding: 0.5rem 1rem; cursor: pointer;">Iniciar Sesión</button>
        <button *ngIf="usuario" (click)="logout()" style="padding: 0.5rem 1rem; cursor: pointer;">Cerrar Sesión</button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  usuario: any = null;

  constructor(private authService: AuthService) {
    this.usuario = this.authService.getAccount();
  }

  async login() {
    await this.authService.login();
    this.usuario = this.authService.getAccount();
  }

  async logout() {
    await this.authService.logout();
    this.usuario = null;
  }
}