import { injectIntl } from 'react-intl';

import { connect } from 'react-redux';

import { NotificationStack } from 'react-notification';

import { dismissAlert } from 'fedired/actions/alerts';
import { getAlerts } from 'fedired/selectors';

const mapStateToProps = (state, { intl }) => ({
  notifications: getAlerts(state, { intl }),
});

const mapDispatchToProps = (dispatch) => ({
  onDismiss (alert) {
    dispatch(dismissAlert(alert));
  },
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(NotificationStack));
