import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthLocalService } from '../../services/auth-local.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  enviando = false;
  errorMensaje = '';

  constructor(
    private fb: FormBuilder,
    private authLocalService: AuthLocalService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.errorMensaje = '';

    const { email, password } = this.loginForm.value;

    this.authLocalService.login(email, password).subscribe({
      next: () => {
        this.enviando = false;
        this.router.navigate(['/catalogo']);
      },
      error: (err) => {
        this.enviando = false;
        this.errorMensaje = err.error?.message || 'Correo o contraseña incorrectos.';
      }
    });
  }

  async loginConAzure(): Promise<void> {
    await this.authService.login();
    this.router.navigate(['/catalogo']);
  }
}