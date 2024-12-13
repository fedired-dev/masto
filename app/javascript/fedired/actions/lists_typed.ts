import { apiCreate, apiUpdate } from 'fedired/api/lists';
import type { List } from 'fedired/models/list';
import { createDataLoadingThunk } from 'fedired/store/typed_functions';

export const createList = createDataLoadingThunk(
  'list/create',
  (list: Partial<List>) => apiCreate(list),
);

export const updateList = createDataLoadingThunk(
  'list/update',
  (list: Partial<List>) => apiUpdate(list),
);
