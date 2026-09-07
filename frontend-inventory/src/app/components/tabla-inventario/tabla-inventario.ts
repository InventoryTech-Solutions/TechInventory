import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-tabla-inventario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-inventario.html',
  styleUrl: './tabla-inventario.css'
})
export class TablaInventarioComponent {
  @Input() productos: Producto[] = [];
  
  @Output() editar = new EventEmitter<Producto>();
  @Output() eliminar = new EventEmitter<number>();
  @Output() cambiarStock = new EventEmitter<{ id: number; nuevoStock: number }>();

  modificarCantidad(producto: Producto, delta: number): void {
    if (producto.id === undefined) return;
    const stockActual = producto.stockActual ?? 0;
    const nuevoStock = Math.max(0, stockActual + delta);
    this.cambiarStock.emit({ id: producto.id, nuevoStock });
  }
}