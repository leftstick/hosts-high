import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import classnames from 'classnames';

import { HOSTS } from '@/constants';
import { useModel } from 'umi';
import styles from './index.less';

function EditableStatus() {
  const { canWriteHost, requestPermission } = useModel('usePermissionModel');

  if (canWriteHost) {
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
        onClick={requestPermission}
      />
    </Tooltip>
  );
}

export default EditableStatus;
