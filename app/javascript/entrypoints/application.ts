import './public-path';
import main from 'fedired/main';

import { start } from '../fedired/common';
import { loadLocale } from '../fedired/locales';
import { loadPolyfills } from '../fedired/polyfills';

start();

loadPolyfills()
  .then(loadLocale)
  .then(main)
  .catch((e: unknown) => {
    console.error(e);
  });
