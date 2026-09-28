import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Producto } from '../models/producto.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function mapearProducto(p: any): Producto {
  return { ...p, stockActual: p.stock };
}

export interface ItemReserva {
  productoId: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = `${environment.apiGatewayUrl}/productos`;
  private apiUrlPublico = `${environment.apiGatewayUrl}/public/productos`;
  private apiUrlReservas = `${environment.apiGatewayUrl}/reservas`;

  constructor(private http: HttpClient) {}

  getProductosPublicos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlPublico);
  }

  reservar(items: ItemReserva[]): Observable<any> {
    return this.http.post<any>(this.apiUrlReservas, { items });
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(lista => lista.map(mapearProducto))
    );
  }

  getProductoPorId(id: number): Observable<Producto> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(mapearProducto)
    );
  }

  crearProducto(producto: Partial<Producto>): Observable<Producto> {
    return this.http.post<any>(this.apiUrl, producto).pipe(
      map(mapearProducto)
    );
  }

  actualizarProducto(id: number, producto: Partial<Producto>): Observable<Producto> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, producto).pipe(
      map(mapearProducto)
    );
  }

  actualizarStock(id: number, nuevoStock: number): Observable<Producto> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/stock`, { stock: nuevoStock }).pipe(
      map(mapearProducto)
    );
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}