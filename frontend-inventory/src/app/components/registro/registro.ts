import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegistroService } from '../../services/registro.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {
  registroForm: FormGroup;
  enviando = false;
  errorMensaje = '';
  exito = false;

  constructor(
    private fb: FormBuilder,
    private registroService: RegistroService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmarPassword: ['', [Validators.required]]
    }, { validators: this.passwordsCoinciden });
  }

  passwordsCoinciden(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmar = form.get('confirmarPassword')?.value;
    return password === confirmar ? null : { passwordsNoCoinciden: true };
  }

  get f() {
    return this.registroForm.controls;
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.errorMensaje = '';

    const { confirmarPassword, ...datos } = this.registroForm.value;

    this.registroService.registrarUsuario(datos).subscribe({
      next: () => {
        this.enviando = false;
        this.exito = true;
        setTimeout(() => this.router.navigate(['/catalogo']), 1500);
      },
      error: (err) => {
        this.enviando = false;
        this.errorMensaje = err.error?.message || 'No se pudo completar el registro. Intenta nuevamente.';
      }
    });
  }
}