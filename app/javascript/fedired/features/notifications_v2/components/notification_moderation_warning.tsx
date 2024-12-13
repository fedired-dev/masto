import { ModerationWarning } from 'fedired/features/notifications/components/moderation_warning';
import type { NotificationGroupModerationWarning } from 'fedired/models/notification_group';

export const NotificationModerationWarning: React.FC<{
  notification: NotificationGroupModerationWarning;
  unread: boolean;
}> = ({ notification: { moderationWarning }, unread }) => (
  <ModerationWarning
    action={moderationWarning.action}
    id={moderationWarning.id}
    unread={unread}
  />
);
