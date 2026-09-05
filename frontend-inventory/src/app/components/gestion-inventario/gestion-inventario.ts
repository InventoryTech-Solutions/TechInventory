import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto } from '../catalogo/catalogo';

@Component({
  selector: 'app-gestion-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-inventario.html',
  styleUrl: './gestion-inventario.css'
})
export class GestionInventarioComponent implements OnInit {
  // Lista inicial de datos (mock)
  productos: Producto[] = [
    { id: 1, nombre: 'Laptop Pro 15"', categoria: 'Electrónica', precio: 1200, stock: 8, imagenUrl: 'https://via.placeholder.com/150' },
    { id: 2, nombre: 'Teclado Mecánico RGB', categoria: 'Accesorios', precio: 85, stock: 15, imagenUrl: 'https://via.placeholder.com/150' },
    { id: 3, nombre: 'Monitor 4K 27"', categoria: 'Electrónica', precio: 350, stock: 4, imagenUrl: 'https://via.placeholder.com/150' },
    { id: 4, nombre: 'Mouse Inalámbrico', categoria: 'Accesorios', precio: 45, stock: 20, imagenUrl: 'https://via.placeholder.com/150' },
    { id: 5, nombre: 'Silla Ergonómica', categoria: 'Oficina', precio: 250, stock: 2, imagenUrl: 'https://via.placeholder.com/150' }
  ];

  categorias: string[] = ['Electrónica', 'Accesorios', 'Oficina'];

  // Estado del formulario
  mostrarFormulario: boolean = false;
  editando: boolean = false;

  productoForm: Producto = this.getProductoVacio();

  ngOnInit(): void {}

  private getProductoVacio(): Producto {
    return {
      id: 0,
      nombre: '',
      categoria: 'Electrónica',
      precio: 0,
      stock: 0,
      imagenUrl: ''
    };
  }

  abrirFormularioNuevo(): void {
    this.editando = false;
    this.productoForm = this.getProductoVacio();
    this.mostrarFormulario = true;
  }

  editarProducto(prod: Producto): void {
    this.editando = true;
    this.productoForm = { ...prod }; // Clonamos para evitar modificar la lista directamente
    this.mostrarFormulario = true;
  }

  guardarProducto(): void {
    if (!this.productoForm.nombre || this.productoForm.precio <= 0) {
      alert('Por favor ingrese un nombre y precio válidos.');
      return;
    }

    if (this.editando) {
      const idx = this.productos.findIndex(p => p.id === this.productoForm.id);
      if (idx !== -1) {
        this.productos[idx] = { ...this.productoForm };
      }
    } else {
      const nuevoId = this.productos.length > 0 ? Math.max(...this.productos.map(p => p.id)) + 1 : 1;
      this.productos.push({
        ...this.productoForm,
        id: nuevoId,
        imagenUrl: this.productoForm.imagenUrl || 'https://via.placeholder.com/150'
      });
    }

    this.cerrarFormulario();
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Está seguro de eliminar este producto del inventario?')) {
      this.productos = this.productos.filter(p => p.id !== id);
    }
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.productoForm = this.getProductoVacio();
  }
}