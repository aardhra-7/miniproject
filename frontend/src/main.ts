import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { WebModule } from './web/web.module';

platformBrowserDynamic().bootstrapModule(WebModule)
    .catch(err => console.error(err));
