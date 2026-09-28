import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Solo agrega el token en llamadas hacia nuestro backend
  if (!req.url.startsWith(environment.apiGatewayUrl)) {
    return next(req);
  }

  // Si no hay sesión, deja pasar la petición sin token (para rutas públicas)
  if (!authService.isLoggedIn()) {
    return next(req);
  }

  return from(authService.getToken()).pipe(
    switchMap(token => {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(authReq);
    })
  );
};