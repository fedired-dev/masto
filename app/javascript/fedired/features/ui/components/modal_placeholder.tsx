import { useCallback } from 'react';

import { FormattedMessage } from 'react-intl';

import { Button } from 'fedired/components/button';
import { GIF } from 'fedired/components/gif';
import { LoadingIndicator } from 'fedired/components/loading_indicator';

export const ModalPlaceholder: React.FC<{
  loading: boolean;
  onClose: (arg0: string | undefined, arg1: boolean) => void;
  onRetry?: () => void;
}> = ({ loading, onClose, onRetry }) => {
  const handleClose = useCallback(() => {
    onClose(undefined, false);
  }, [onClose]);

  const handleRetry = useCallback(() => {
    if (onRetry) onRetry();
  }, [onRetry]);

  return (
    <div className='modal-root__modal modal-placeholder' aria-busy={loading}>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <div className='modal-placeholder__error'>
          <GIF
            src='/oops.gif'
            staticSrc='https://raw.githubusercontent.com/fedired-dev/img/refs/heads/main/custom/error.webp'
            className='modal-placeholder__error__image'
          />

          <div className='modal-placeholder__error__message'>
            <p>
              <FormattedMessage
                id='bundle_modal_error.message'
                defaultMessage='Something went wrong while loading this screen.'
              />
            </p>

            <div className='modal-placeholder__error__message__actions'>
              <Button onClick={handleRetry}>
                <FormattedMessage
                  id='bundle_modal_error.retry'
                  defaultMessage='Try again'
                />
              </Button>
              <Button onClick={handleClose} className='button button-tertiary'>
                <FormattedMessage
                  id='bundle_modal_error.close'
                  defaultMessage='Close'
                />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
