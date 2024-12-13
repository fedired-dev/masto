import { Provider } from 'react-redux';

import { fetchCustomEmojis } from 'fedired/actions/custom_emojis';
import { hydrateStore } from 'fedired/actions/store';
import { Router } from 'fedired/components/router';
import Compose from 'fedired/features/standalone/compose';
import initialState from 'fedired/initial_state';
import { IntlProvider } from 'fedired/locales';
import { store } from 'fedired/store';

if (initialState) {
  store.dispatch(hydrateStore(initialState));
}

store.dispatch(fetchCustomEmojis());

const ComposeContainer = () => (
  <IntlProvider>
    <Provider store={store}>
      <Router>
        <Compose />
      </Router>
    </Provider>
  </IntlProvider>
);

export default ComposeContainer;
