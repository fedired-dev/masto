import { apiRequestGet, apiRequestDelete } from 'fedired/api';
import type { ApiSuggestionJSON } from 'fedired/api_types/suggestions';

export const apiGetSuggestions = (limit: number) =>
  apiRequestGet<ApiSuggestionJSON[]>('v2/suggestions', { limit });

export const apiDeleteSuggestion = (accountId: string) =>
  apiRequestDelete(`v1/suggestions/${accountId}`);
