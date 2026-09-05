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

    return response.accessToken;
  }

  getAccount() {
    return this.msalInstance.getAllAccounts()[0];
  }

  isLoggedIn(): boolean {
    return !!this.getAccount();
  }
}