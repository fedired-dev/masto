import type { RecordOf } from 'immutable';

import type { ApiPreviewCardJSON } from 'fedired/api_types/statuses';

export type { StatusVisibility } from 'fedired/api_types/statuses';

// Temporary until we type it correctly
export type Status = Immutable.Map<string, unknown>;

type CardShape = Required<ApiPreviewCardJSON>;

export type Card = RecordOf<CardShape>;

export type MediaAttachment = Immutable.Map<string, unknown>;
