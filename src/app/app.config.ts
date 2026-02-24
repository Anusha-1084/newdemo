import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // Using provideAnimations (recommended for Angular Material)
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FullCalendarModule } from '@fullcalendar/angular';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideClientHydration(),
    importProvidersFrom(FullCalendarModule),
    provideAnimations(), // ✅ Angular Material compatible animations
    provideHttpClient(withFetch())
  ]
};
