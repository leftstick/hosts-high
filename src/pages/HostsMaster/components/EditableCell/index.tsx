import { useRef, useState } from 'react';

import { useClickAway } from 'ahooks';
import { useModel } from 'umi';

import { IHost } from '@/IType';
import EditArea from './EditArea';

function EditableCell({
  record,
  property,
}: {
  record: IHost;
  property: Exclude<keyof IHost, 'disabled' | 'invalid'>;
}) {
  const [editing, setEditing] = useState(false);
  const { canWriteHost } = useModel('usePermissionModel');
  const { modifyHostField } = useModel('useHostsModel');
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(() => {
    setEditing(false);
  }, ref);

  if (!editing) {
    return (
      <div
        style={{ height: '21px', width: '100%' }}
        onDoubleClick={() => {
          if (canWriteHost) {
            setEditing(true);
          }
        }}
      >
        {record[property]}
      </div>
    );
  }

  return (
    <div ref={ref}>
      <EditArea
        record={record}
        property={property}
        onChange={(val) => {
          setEditing(false);
          modifyHostField(property, val, record);
        }}
      />
    </div>
  );
}

export default EditableCell;
