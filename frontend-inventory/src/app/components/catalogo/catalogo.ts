import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localeEsCl from '@angular/common/locales/es-CL';

// Registrar la configuración regional de Chile para usar '.' en miles
registerLocaleData(localeEsCl, 'es-CL');

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
export class CatalogoComponent implements OnInit {

  productos: Producto[] = [
    { 
      id: 1, 
      nombre: 'Laptop Pro 15"', 
      categoria: 'Electrónica', 
      precio: 1200000, 
      stock: 8, 
      imagenUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80' 
    },
    { 
      id: 2, 
      nombre: 'Teclado Mecánico RGB', 
      categoria: 'Accesorios', 
      precio: 85000, 
      stock: 15, 
      imagenUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80' 
    },
    { 
      id: 3, 
      nombre: 'Monitor 4K 27"', 
      categoria: 'Electrónica', 
      precio: 350000, 
      stock: 4, 
      imagenUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80' 
    },
    { 
      id: 4, 
      nombre: 'Mouse Inalámbrico', 
      categoria: 'Accesorios', 
      precio: 45000, 
      stock: 20, 
      imagenUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80' 
    },
    { 
      id: 5, 
      nombre: 'Silla Ergonómica', 
      categoria: 'Oficina', 
      precio: 250000, 
      stock: 2, 
      imagenUrl: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500&q=80' 
    }
  ];

  categorias: string[] = ['Todas', 'Electrónica', 'Accesorios', 'Oficina'];
  
  filtroTexto: string = '';
  categoriaSeleccionada: string = 'Todas';
  
  productoSeleccionado: Producto | null = null;
  
  carrito: ItemCarrito[] = [];
  mostrarCarritoModal: boolean = false;

  ngOnInit(): void {}

  get productosFiltrados(): Producto[] {
    return this.productos.filter(p => {
      const coincideTexto = p.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase());
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
    alert('¡Reserva realizada con éxito!');
    this.carrito = [];
    this.cerrarCarrito();
  }
}