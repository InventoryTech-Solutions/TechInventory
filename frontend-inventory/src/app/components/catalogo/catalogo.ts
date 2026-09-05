import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagenUrl: string;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {
  filtroTexto: string = '';
  categoriaSeleccionada: string = 'Todas';

  // Datos mock temporalmente
  productos: Producto[] = [
    { id: 1, nombre: 'Laptop Pro 15"', categoria: 'Electrónica', precio: 1200, stock: 8, imagenUrl: 'https://via.placeholder.com/150' },
    { id: 2, nombre: 'Teclado Mecánico RGB', categoria: 'Accesorios', precio: 85, stock: 15, imagenUrl: 'https://via.placeholder.com/150' },
    { id: 3, nombre: 'Monitor 4K 27"', categoria: 'Electrónica', precio: 350, stock: 4, imagenUrl: 'https://via.placeholder.com/150' },
    { id: 4, nombre: 'Mouse Inalámbrico', categoria: 'Accesorios', precio: 45, stock: 20, imagenUrl: 'https://via.placeholder.com/150' },
    { id: 5, nombre: 'Silla Ergonómica', categoria: 'Oficina', precio: 250, stock: 2, imagenUrl: 'https://via.placeholder.com/150' }
  ];

  categorias: string[] = ['Todas', 'Electrónica', 'Accesorios', 'Oficina'];

  ngOnInit(): void {}

  get productosFiltrados(): Producto[] {
    return this.productos.filter(p => {
      const coincideTexto = p.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const coincideCategoria = this.categoriaSeleccionada === 'Todas' || p.categoria === this.categoriaSeleccionada;
      return coincideTexto && coincideCategoria;
    });
  }
}