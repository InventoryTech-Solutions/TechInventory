import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private apiUrl = `${environment.apiGatewayUrl}/auth/registro`;

  constructor(private http: HttpClient) {}

  registrarUsuario(datos: Partial<Usuario>): Observable<Usuario> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Usuario>(this.apiUrl, datos, { headers });
  }
}