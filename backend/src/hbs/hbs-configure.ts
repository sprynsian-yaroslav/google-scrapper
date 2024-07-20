import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import components from "./components"
import helpers from "./helpers"

export function configureHandlebars(app: NestExpressApplication) {
  app.setViewEngine('hbs');
  app.useStaticAssets(join(__dirname, '../../..', 'public'));
  app.setBaseViewsDir(join(__dirname, '../../..', 'views'));
  hbs.registerPartials(join(__dirname, '../../..', 'views/partials'));

  const hbsHelpers = {
    ...components,
    ...helpers
  }

  Object.entries(hbsHelpers).forEach(([key, callback]) => {
    hbs.registerHelper(key, callback)
  })
}
