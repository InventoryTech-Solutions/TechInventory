import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthLocalService } from '../../services/auth-local.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  usuario: any = null;

  constructor(
    public authService: AuthService,
    public authLocalService: AuthLocalService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getAccount();
  }

  get estaLogueado(): boolean {
    return this.authService.isLoggedIn() || this.authLocalService.isLoggedIn();
  }

  get usuarioNombre(): string {
    const usuarioLocal = this.authLocalService.getUsuario();
    if (usuarioLocal) return usuarioLocal.nombre;
    return this.usuario?.name || this.usuario?.nombre || 'Usuario';
  }

  async cerrarSesion(): Promise<void> {
    if (this.authLocalService.isLoggedIn()) {
      this.authLocalService.logout();
    } else {
      await this.authService.logout();
    }
    this.usuario = null;
  }
}