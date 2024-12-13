import ComposeFormContainer from 'fedired/features/compose/containers/compose_form_container';
import LoadingBarContainer from 'fedired/features/ui/containers/loading_bar_container';
import ModalContainer from 'fedired/features/ui/containers/modal_container';
import NotificationsContainer from 'fedired/features/ui/containers/notifications_container';

const Compose = () => (
  <>
    <ComposeFormContainer autoFocus withoutNavigation />
    <NotificationsContainer />
    <ModalContainer />
    <LoadingBarContainer className='loading-bar' />
  </>
);

export default Compose;
