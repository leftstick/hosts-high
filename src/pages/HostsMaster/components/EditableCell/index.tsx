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
  property: Exclude<keyof IHost, 'disabled'>;
}) {
  const [editing, setEditing] = useState(false);
  const { acquired } = useModel('usePermissionModel');
  const { modifyHost } = useModel('useHostsModel');
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(() => {
    setEditing(false);
  }, ref);

  if (!editing) {
    return (
      <div
        style={{ height: '21px', width: '100%' }}
        onDoubleClick={() => {
          if (acquired) {
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
          modifyHost(record, {
            ...record,
            [property]: val,
          });
        }}
      />
    </div>
  );
}

export default EditableCell;
