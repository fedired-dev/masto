import { createAction } from '@reduxjs/toolkit';

import {
  apiGetNotificationPolicy,
  apiUpdateNotificationsPolicy,
} from 'fedired/api/notification_policies';
import type { NotificationPolicy } from 'fedired/models/notification_policy';
import { createDataLoadingThunk } from 'fedired/store/typed_functions';

export const fetchNotificationPolicy = createDataLoadingThunk(
  'notificationPolicy/fetch',
  () => apiGetNotificationPolicy(),
);

export const updateNotificationsPolicy = createDataLoadingThunk(
  'notificationPolicy/update',
  (policy: Partial<NotificationPolicy>) => apiUpdateNotificationsPolicy(policy),
);

export const decreasePendingRequestsCount = createAction<number>(
  'notificationPolicy/decreasePendingRequestsCount',
);
