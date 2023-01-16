import {
  DeleteOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';

import classnames from 'classnames';
import { useModel } from 'umi';

import { IHost } from '@/IType';

import styles from './index.less';

function OperationRenderer({ data }: { data: IHost }) {
  const { canWriteHost } = useModel('usePermissionModel');
  const { modifyHostField, delHost } = useModel('useHostsModel');

  return (
    <div className={styles.oper}>
      {!data.disabled && (
        <Tooltip
          title="Click to disable this rule"
          overlayStyle={{ width: 170 }}
        >
          <PauseCircleOutlined
            className={classnames(styles.pauseBtn, {
              [styles.disableBtn]: !canWriteHost,
            })}
            onClick={() => modifyHostField('disabled', true, data)}
          />
        </Tooltip>
      )}
      {data.disabled && (
        <Tooltip
          title="Click to enable this rule"
          overlayStyle={{ width: 170 }}
        >
          <PlayCircleOutlined
            className={classnames(styles.enableBtn, {
              [styles.disableBtn]: !canWriteHost,
            })}
            onClick={() => modifyHostField('disabled', false, data)}
          />
        </Tooltip>
      )}
      <Tooltip title="Click to delete this rule" overlayStyle={{ width: 165 }}>
        <DeleteOutlined
          style={{ marginLeft: 15 }}
          className={classnames(styles.delBtn, {
            [styles.disableBtn]: !canWriteHost,
          })}
          onClick={() => delHost(data)}
        />
      </Tooltip>
    </div>
  );
}

export default OperationRenderer;
