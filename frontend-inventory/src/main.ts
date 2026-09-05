import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';
import { MsalService } from '@azure/msal-angular';

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    const msalService = appRef.injector.get(MsalService);
    return msalService.instance.initialize().then(() => {
      return msalService.instance.handleRedirectPromise();
    });
  })
  .catch(err => console.error(err));
  