import './public-path';
import { createRoot } from 'react-dom/client';

import { start } from '../fedired/common';
import ComposeContainer from '../fedired/containers/compose_container';
import { loadPolyfills } from '../fedired/polyfills';
import ready from '../fedired/ready';

start();

function loaded() {
  const mountNode = document.getElementById('fedired-compose');

  if (mountNode) {
    const attr = mountNode.getAttribute('data-props');

    if (!attr) return;

    const props = JSON.parse(attr) as object;
    const root = createRoot(mountNode);

    root.render(<ComposeContainer {...props} />);
  }
}

function main() {
  ready(loaded).catch((error: unknown) => {
    console.error(error);
  });
}

loadPolyfills()
  .then(main)
  .catch((error: unknown) => {
    console.error(error);
  });
