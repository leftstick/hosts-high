import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import classnames from 'classnames';

import { HOSTS } from '@/utils';
import { useModel } from 'umi';
import styles from './index.less';

function EditableStatus() {
  const { acquired, permissionAcquired } = useModel('usePermissionModel');

  if (acquired) {
    return (
      <Tooltip title={`${HOSTS} is editable now`} placement="right">
        <UnlockOutlined className={classnames(styles.lockBasis)} />
      </Tooltip>
    );
  }

  return (
    <Tooltip title="Click to acquire permission" placement="right">
      <LockOutlined
        className={classnames(styles.lockBasis, styles.clickable)}
        onClick={permissionAcquired}
      />
    </Tooltip>
  );
}

export default EditableStatus;
