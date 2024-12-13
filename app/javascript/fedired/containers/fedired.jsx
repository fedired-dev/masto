import { PureComponent } from 'react';

import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';

import { Provider as ReduxProvider } from 'react-redux';

import { ScrollContext } from 'react-router-scroll-4';

import { fetchCustomEmojis } from 'fedired/actions/custom_emojis';
import { hydrateStore } from 'fedired/actions/store';
import { connectUserStream } from 'fedired/actions/streaming';
import ErrorBoundary from 'fedired/components/error_boundary';
import { Router } from 'fedired/components/router';
import UI from 'fedired/features/ui';
import { IdentityContext, createIdentityContext } from 'fedired/identity_context';
import initialState, { title as siteTitle } from 'fedired/initial_state';
import { IntlProvider } from 'fedired/locales';
import { store } from 'fedired/store';
import { isProduction } from 'fedired/utils/environment';

const title = isProduction() ? siteTitle : `${siteTitle} (Dev)`;

const hydrateAction = hydrateStore(initialState);

store.dispatch(hydrateAction);
if (initialState.meta.me) {
  store.dispatch(fetchCustomEmojis());
}

export default class Fedired extends PureComponent {
  identity = createIdentityContext(initialState);

  componentDidMount() {
    if (this.identity.signedIn) {
      this.disconnect = store.dispatch(connectUserStream());
    }
  }

  componentWillUnmount () {
    if (this.disconnect) {
      this.disconnect();
      this.disconnect = null;
    }
  }

  shouldUpdateScroll (prevRouterProps, { location }) {
    return !(location.state?.fediredModalKey && location.state?.fediredModalKey !== prevRouterProps?.location?.state?.fediredModalKey);
  }

  render () {
    return (
      <IdentityContext.Provider value={this.identity}>
        <IntlProvider>
          <ReduxProvider store={store}>
            <ErrorBoundary>
              <Router>
                <ScrollContext shouldUpdateScroll={this.shouldUpdateScroll}>
                  <Route path='/' component={UI} />
                </ScrollContext>
              </Router>

              <Helmet defaultTitle={title} titleTemplate={`%s - ${title}`} />
            </ErrorBoundary>
          </ReduxProvider>
        </IntlProvider>
      </IdentityContext.Provider>
    );
  }

}
