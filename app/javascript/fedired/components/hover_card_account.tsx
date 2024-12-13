import { useEffect, forwardRef } from 'react';

import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { fetchAccount } from 'fedired/actions/accounts';
import { AccountBio } from 'fedired/components/account_bio';
import { AccountFields } from 'fedired/components/account_fields';
import { Avatar } from 'fedired/components/avatar';
import { FollowersCounter } from 'fedired/components/counters';
import { DisplayName } from 'fedired/components/display_name';
import { FollowButton } from 'fedired/components/follow_button';
import { LoadingIndicator } from 'fedired/components/loading_indicator';
import { ShortNumber } from 'fedired/components/short_number';
import { domain } from 'fedired/initial_state';
import { useAppSelector, useAppDispatch } from 'fedired/store';

export const HoverCardAccount = forwardRef<
  HTMLDivElement,
  { accountId?: string }
>(({ accountId }, ref) => {
  const dispatch = useAppDispatch();

  const account = useAppSelector((state) =>
    accountId ? state.accounts.get(accountId) : undefined,
  );

  const note = useAppSelector(
    (state) =>
      state.relationships.getIn([accountId, 'note']) as string | undefined,
  );

  useEffect(() => {
    if (accountId && !account) {
      dispatch(fetchAccount(accountId));
    }
  }, [dispatch, accountId, account]);

  return (
    <div
      ref={ref}
      id='hover-card'
      role='tooltip'
      className={classNames('hover-card dropdown-animation', {
        'hover-card--loading': !account,
      })}
    >
      {account ? (
        <>
          <Link to={`/@${account.acct}`} className='hover-card__name'>
            <Avatar account={account} size={46} />
            <DisplayName account={account} localDomain={domain} />
          </Link>

          <div className='hover-card__text-row'>
            <AccountBio
              note={account.note_emojified}
              className='hover-card__bio'
            />
            <AccountFields fields={account.fields} limit={2} />
            {note && note.length > 0 && (
              <dl className='hover-card__note'>
                <dt className='hover-card__note-label'>
                  <FormattedMessage
                    id='account.account_note_header'
                    defaultMessage='Personal note'
                  />
                </dt>
                <dd>{note}</dd>
              </dl>
            )}
          </div>

          <div className='hover-card__number'>
            <ShortNumber
              value={account.followers_count}
              renderer={FollowersCounter}
            />
          </div>

          <FollowButton accountId={accountId} />
        </>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  );
});

HoverCardAccount.displayName = 'HoverCardAccount';
