import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-producto.html',
  styleUrl: './modal-producto.css'
})
export class ModalProductoComponent implements OnInit {
  @Input() productoEditar: Producto | null = null;
  @Output() guardar = new EventEmitter<Partial<Producto>>();
  @Output() cerrar = new EventEmitter<void>();

  productoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: [this.productoEditar?.nombre || '', [Validators.required, Validators.minLength(3)]],
      categoria: [this.productoEditar?.categoria || 'Electrónica', [Validators.required]],
      precio: [this.productoEditar?.precio || 0, [Validators.required, Validators.min(1)]],
      stockActual: [this.productoEditar?.stockActual || 0, [Validators.required, Validators.min(0)]],
      codigoBarras: [this.productoEditar?.codigoBarras || ''],
      ubicacionBodega: [this.productoEditar?.ubicacionBodega || ''],
      imagenUrl: [this.productoEditar?.imagenUrl || '']
    });
  }

  onSubmit(): void {
    if (this.productoForm.valid) {
      const valores = this.productoForm.value;

      // El backend espera el campo "stock", el formulario usa "stockActual"
      const datosParaBackend = {
        ...valores,
        stock: valores.stockActual
      };
      delete datosParaBackend.stockActual;

      this.guardar.emit(datosParaBackend);
    }
  }

  onCerrar(): void {
    this.cerrar.emit();
  }
}