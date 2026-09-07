import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto.model';
import { TablaInventarioComponent } from '../tabla-inventario/tabla-inventario';
import { ModalProductoComponent } from '../modal-producto/modal-producto';

@Component({
  selector: 'app-gestion-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, TablaInventarioComponent, ModalProductoComponent],
  templateUrl: './gestion-inventario.html',
  styleUrl: './gestion-inventario.css'
})
export class GestionInventarioComponent implements OnInit {
  productos: Producto[] = [];
  filtroTexto: string = '';
  filtroEstado: string = 'TODOS';
  
  mostrarModal: boolean = false;
  productoEditar: Producto | null = null;

  constructor(private inventarioService: InventarioService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.inventarioService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar inventario', err)
    });
  }

  // KPIs
  get totalProductos(): number {
    return this.productos.length;
  }

  get totalStockCritico(): number {
    return this.productos.filter(p => (p.stockActual ?? 0) < 10).length;
  }

  get valorTotalInventario(): number {
    return this.productos.reduce((acc, p) => acc + (p.precio * (p.stockActual ?? 0)), 0);
  }

  // Filtrado
  get productosFiltrados(): Producto[] {
    return this.productos.filter(p => {
      const coincideTexto = p.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const stock = p.stockActual ?? 0;
      
      let coincideEstado = true;
      if (this.filtroEstado === 'CRITICO') coincideEstado = stock > 0 && stock < 10;
      else if (this.filtroEstado === 'AGOTADO') coincideEstado = stock === 0;

      return coincideTexto && coincideEstado;
    });
  }

  // Operaciones CRUD
  abrirModalCrear(): void {
    this.productoEditar = null;
    this.mostrarModal = true;
  }

  abrirModalEditar(producto: Producto): void {
    this.productoEditar = producto;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoEditar = null;
  }

  guardarProducto(datos: Partial<Producto>): void {
    if (this.productoEditar && this.productoEditar.id !== undefined) {
      this.inventarioService.actualizarProducto(this.productoEditar.id, datos).subscribe(() => {
        this.cargarProductos();
        this.cerrarModal();
      });
    } else {
      this.inventarioService.crearProducto(datos).subscribe(() => {
        this.cargarProductos();
        this.cerrarModal();
      });
    }
  }

  actualizarStockEvento(event: { id: number; nuevoStock: number }): void {
    this.inventarioService.actualizarStock(event.id, event.nuevoStock).subscribe(() => {
      this.cargarProductos();
    });
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este producto del inventario?')) {
      this.inventarioService.eliminarProducto(id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }
}