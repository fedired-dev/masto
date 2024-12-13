import { Column } from 'fedired/components/column';
import { ColumnHeader } from 'fedired/components/column_header';
import type { Props as ColumnHeaderProps } from 'fedired/components/column_header';

export const ColumnLoading: React.FC<ColumnHeaderProps> = (otherProps) => (
  <Column>
    <ColumnHeader {...otherProps} />
    <div className='scrollable' />
  </Column>
);
