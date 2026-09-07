import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  usuario: any = null;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.authService.getAccount();
  }

  get usuarioNombre(): string {
    return this.usuario?.name || this.usuario?.nombre || 'Usuario';
  }

  async iniciarSesion(): Promise<void> {
    await this.authService.login();
    this.usuario = this.authService.getAccount();
  }

  async cerrarSesion(): Promise<void> {
    await this.authService.logout();
    this.usuario = null;
  }
}