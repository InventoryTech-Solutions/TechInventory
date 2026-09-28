import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../../services/inventario.service';
import { AuthService } from '../../services/auth.service';
import { Subscription, interval } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagenUrl: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit, OnDestroy {

  productos: Producto[] = [];
  categorias: string[] = ['Todas'];
  filtroTexto: string = '';
  categoriaSeleccionada: string = 'Todas';
  productoSeleccionado: Producto | null = null;
  carrito: ItemCarrito[] = [];
  mostrarCarritoModal: boolean = false;

  private placeholderImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect width="300" height="200" fill="%23e5e7eb"/%3E%3Ctext x="150" y="105" font-family="sans-serif" font-size="16" fill="%236b7280" text-anchor="middle"%3ESin imagen%3C/text%3E%3C/svg%3E';

  private subscripcion?: Subscription;

  constructor(
    private inventarioService: InventarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    // Refresca el stock cada 5 segundos mientras el catálogo está abierto
    this.subscripcion = interval(5000).subscribe(() => this.cargarProductos());
  }

  ngOnDestroy(): void {
    this.subscripcion?.unsubscribe();
  }

  cargarProductos(): void {
    this.inventarioService.getProductosPublicos().subscribe({
      next: (data) => this.mapearYAsignar(data),
      error: (err) => console.error('Error al cargar el catálogo', err)
    });
  }

  private mapearYAsignar(data: any[]): void {
    this.productos = data.map((p: any) => ({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      precio: p.precio,
      stock: p.stock,
      imagenUrl: p.urlImagen || this.placeholderImg
    }));

    const categoriasUnicas = Array.from(new Set(this.productos.map(p => p.categoria)));
    this.categorias = ['Todas', ...categoriasUnicas];
  }

  get productosFiltrados(): Producto[] {
    return this.productos.filter(p => {
      const coincideTexto = (p.nombre ?? '').toLowerCase().includes(this.filtroTexto.toLowerCase());
      const coincideCategoria = this.categoriaSeleccionada === 'Todas' || p.categoria === this.categoriaSeleccionada;
      return coincideTexto && coincideCategoria;
    });
  }

  get totalItemsCarrito(): number {
    return this.carrito.reduce((acc, item) => acc + item.cantidad, 0);
  }

  get precioTotalCarrito(): number {
    return this.carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  }

  seleccionarProducto(producto: Producto): void {
    this.productoSeleccionado = producto;
  }

  cerrarModal(): void {
    this.productoSeleccionado = null;
  }

  agregarAlCarrito(producto: Producto): void {
    if (producto.stock <= 0) return;

    const itemExistente = this.carrito.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      if (itemExistente.cantidad < producto.stock) {
        itemExistente.cantidad++;
      } else {
        alert('No hay más stock disponible de este producto.');
      }
    } else {
      this.carrito.push({ producto, cantidad: 1 });
    }

    this.cerrarModal();
  }

  abrirCarrito(): void {
    this.mostrarCarritoModal = true;
  }

  cerrarCarrito(): void {
    this.mostrarCarritoModal = false;
  }

  eliminarDelCarrito(productoId: number): void {
    this.carrito = this.carrito.filter(item => item.producto.id !== productoId);
  }

  finalizarPedido(): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para confirmar la reserva.');
      return;
    }

    const items = this.carrito.map(i => ({ productoId: i.producto.id, cantidad: i.cantidad }));

    this.inventarioService.reservar(items).subscribe({
      next: () => {
        alert('¡Reserva realizada con éxito!');
        this.carrito = [];
        this.cerrarCarrito();
        this.cargarProductos();
      },
      error: (err) => {
        if (err.status === 401) {
          alert('Tu sesión expiró. Inicia sesión nuevamente.');
        } else if (err.status === 409) {
          alert(err.error?.mensaje || 'No hay stock suficiente.');
          this.cargarProductos();
        } else {
          alert('No se pudo completar la reserva. Intenta nuevamente.');
        }
      }
    });
  }
}