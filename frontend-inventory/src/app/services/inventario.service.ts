import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Producto } from '../models/producto.model';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = `${environment.apiGatewayUrl}/productos`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Genera los headers básicos y agrega el Token si el usuario inició sesión
  private getHeaders(): Observable<HttpHeaders> {
    return from(this.authService.getToken()).pipe(
      map(token => {
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      }),
      catchError(() => {
        // Si no hay sesión iniciada, retorna las cabeceras estándar para pruebas locales
        return of(new HttpHeaders({ 'Content-Type': 'application/json' }));
      })
    );
  }

  // Obtenemos la lista completa de productos
  getProductos(): Observable<Producto[]> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<Producto[]>(this.apiUrl, { headers }))
    );
  }

  // Obtener producto por ID
  getProductoPorId(id: number): Observable<Producto> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<Producto>(`${this.apiUrl}/${id}`, { headers }))
    );
  }

  // Crear un nuevo producto en inventario
  crearProducto(producto: Partial<Producto>): Observable<Producto> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.post<Producto>(this.apiUrl, producto, { headers }))
    );
  }

  // Actualizar stock o información del producto
  actualizarProducto(id: number, producto: Partial<Producto>): Observable<Producto> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.put<Producto>(`${this.apiUrl}/${id}`, producto, { headers }))
    );
  }

  // Actualización rápida de stock
  actualizarStock(id: number, nuevoStock: number): Observable<Producto> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.patch<Producto>(`${this.apiUrl}/${id}/stock`, { stock: nuevoStock }, { headers }))
    );
  }

  // Eliminar producto
  eliminarProducto(id: number): Observable<void> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }))
    );
  }
}