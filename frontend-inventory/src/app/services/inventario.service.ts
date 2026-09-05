import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { Producto } from '../models/producto.model';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private apiUrl = `${environment.apiGatewayUrl}/productos`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): Observable<HttpHeaders> {
    return from(this.authService.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        return [headers];
      })
    );
  }

  getProductos(): Observable<Producto[]> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<Producto[]>(this.apiUrl, { headers }))
    );
  }
}