import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatNativeDateModule } from '@angular/material/core';
import { jwtInterceptor } from './app/core/interceptors/jwt.interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { appConfig } from './app/app.config'; // ✅ Add this line

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideAnimations(), // ✅ Required for Angular Material
    importProvidersFrom(MatNativeDateModule), // ✅ Native Date module
    provideCharts(withDefaultRegisterables()), // ✅ Charts support
  ]
})
  .then(() =>
    console.log(
      '%c✅ Application Bootstrapped Successfully!',
      'color: green; font-weight: bold;'
    )
  )
  .catch(err =>
    console.error(
      '%c❌ Error Bootstrapping Application:',
      'color: red; font-weight: bold;',
      err
    )
  );