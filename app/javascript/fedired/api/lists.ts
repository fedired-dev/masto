import {
  apiRequestPost,
  apiRequestPut,
  apiRequestGet,
  apiRequestDelete,
} from 'fedired/api';
import type { ApiAccountJSON } from 'fedired/api_types/accounts';
import type { ApiListJSON } from 'fedired/api_types/lists';

export const apiCreate = (list: Partial<ApiListJSON>) =>
  apiRequestPost<ApiListJSON>('v1/lists', list);

export const apiUpdate = (list: Partial<ApiListJSON>) =>
  apiRequestPut<ApiListJSON>(`v1/lists/${list.id}`, list);

export const apiGetAccounts = (listId: string) =>
  apiRequestGet<ApiAccountJSON[]>(`v1/lists/${listId}/accounts`, {
    limit: 0,
  });

export const apiGetAccountLists = (accountId: string) =>
  apiRequestGet<ApiListJSON[]>(`v1/accounts/${accountId}/lists`);

export const apiAddAccountToList = (listId: string, accountId: string) =>
  apiRequestPost(`v1/lists/${listId}/accounts`, {
    account_ids: [accountId],
  });

export const apiRemoveAccountFromList = (listId: string, accountId: string) =>
  apiRequestDelete(`v1/lists/${listId}/accounts`, {
    account_ids: [accountId],
  });
