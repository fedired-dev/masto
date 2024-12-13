import type { ApiHashtagJSON } from 'fedired/api_types/tags';

export type Hashtag = ApiHashtagJSON;

export const createHashtag = (serverJSON: ApiHashtagJSON): Hashtag => ({
  ...serverJSON,
});
