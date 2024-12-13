import { apiSubmitAccountNote } from 'fedired/api/accounts';
import { createDataLoadingThunk } from 'fedired/store/typed_functions';

export const submitAccountNote = createDataLoadingThunk(
  'account_note/submit',
  ({ accountId, note }: { accountId: string; note: string }) =>
    apiSubmitAccountNote(accountId, note),
  (relationship) => ({ relationship }),
);
