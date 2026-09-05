export const environment = {
  production: false,
  apiGatewayUrl: 'https://lk7j2r33td.execute-api.us-east-1.amazonaws.com',
  azure: {
    clientId: '489756c2-cdbb-4f16-8147-838100b537ea',
    authority: 'https://login.microsoftonline.com/ddfccc4f-6e03-4e1c-90b3-e5ba0d8a9523',
    redirectUri: 'http://localhost:4200',
    scopes: ['api://0a8285a1-9a6e-4150-9ffc-57c1badf3bff/api.read']
  }
};

export const msalConfig = {
  auth: {
    clientId: environment.azure.clientId,
    authority: environment.azure.authority,
    redirectUri: environment.azure.redirectUri
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false
  }
};