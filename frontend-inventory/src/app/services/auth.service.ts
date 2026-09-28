import { Injectable } from '@angular/core';
import { PublicClientApplication, AuthenticationResult } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private msalInstance = new PublicClientApplication({
    auth: {
      clientId: environment.azure.clientId,
      authority: environment.azure.authority,
      redirectUri: environment.azure.redirectUri
    },
    cache: {
      cacheLocation: 'localStorage'
    }
  });

  private rolesCache: string[] = [];

  async init(): Promise<void> {
    await this.msalInstance.initialize();
    await this.msalInstance.handleRedirectPromise();
  }

  async login(): Promise<void> {
    await this.msalInstance.loginRedirect({
      scopes: environment.azure.scopes
    });
  }

  async logout(): Promise<void> {
    await this.msalInstance.logoutRedirect({
      postLogoutRedirectUri: environment.azure.redirectUri
    });
  }

  async getToken(): Promise<string> {
    const account = this.msalInstance.getAllAccounts()[0];
    if (!account) throw new Error('No hay usuario autenticado');

    const response: AuthenticationResult = await this.msalInstance.acquireTokenSilent({
      account: account,
      scopes: environment.azure.scopes
    }).catch(async () => {
      await this.msalInstance.acquireTokenRedirect({
        scopes: environment.azure.scopes
      });
      throw new Error('Redirigiendo para renovar token...');
    });

    // Guardamos los roles del token para consultarlos de forma síncrona en la UI
    this.rolesCache = this.decodificarRoles(response.accessToken);

    return response.accessToken;
  }

  // Decodifica solo la parte de claims del JWT (sin validar firma; eso ya lo hace el backend)
  private decodificarRoles(token: string): string[] {
    try {
      const payload = token.split('.')[1];
      const jsonPayload = decodeURIComponent(
        atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const claims = JSON.parse(jsonPayload);
      return claims.roles ?? [];
    } catch {
      return [];
    }
  }

  // Solo para uso visual en la UI (ocultar/mostrar botones). La seguridad real la aplica el backend.
  esAdmin(): boolean {
    return this.rolesCache.includes('Admin');
  }

  getAccount() {
    return this.msalInstance.getAllAccounts()[0];
  }

  isLoggedIn(): boolean {
    return !!this.getAccount();
  }
}