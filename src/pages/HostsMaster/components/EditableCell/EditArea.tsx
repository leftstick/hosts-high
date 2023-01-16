import { IHost } from '@/IType';
import { isDomains, isIp } from '@/utils';
import { useClickAway } from 'ahooks';
import { Input, Tooltip } from 'antd';
import { useCallback, useRef, useState } from 'react';

interface IEditAreaProps {
  property: 'ip' | 'domain' | 'alias';
  record: IHost;
  onChange: (val: string) => void;
}

export default function EditArea({
  property,
  record,
  onChange,
}: IEditAreaProps) {
  const [value, setValue] = useState<string>(record[property]);
  const [error, setError] = useState<string>();

  const ref = useRef<HTMLDivElement>(null);

  const submit = useCallback(() => {
    if (error) {
      return;
    }
    onChange(value);
  }, [error, onChange, value]);

  useClickAway(() => {
    submit();
  }, ref);

  return (
    <Tooltip
      title={error}
      open={!!error}
      color="red"
      getPopupContainer={(trigger) => trigger.parentElement!}
    >
      <div ref={ref}>
        <Input
          autoFocus
          style={{ height: '26px' }}
          value={value}
          onPressEnter={submit}
          onChange={(e) => {
            const val = e.target.value;
            setValue(val);
            if (['ip', 'domain'].includes(property) && !val) {
              setError(`${property} is required`);
              return;
            }
            if ('ip' === property && !isIp(val)) {
              setError('incorrect ip format');
              return;
            }
            if ('domain' === property && !isDomains(val)) {
              setError('incorrect domains format');
              return;
            }
            if ('alias' === property && val.length > 15) {
              setError('alias cannot be longer than 15 characters');
              return;
            }
            setError('');
          }}
        />
      </div>
    </Tooltip>
  );
}
