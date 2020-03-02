import { Tooltip } from 'antd'
import { UnlockOutlined, LockOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import { useModel } from 'umi'
import { HOSTS } from '@/helpers/os'

import styles from '@/pages/index/components/EditableStatus/index.less'

function EditableStatus() {
  const { acquired, permissionAcquired } = useModel('usePermissionModel')

  if (acquired) {
    return (
      <Tooltip title={`${HOSTS} is editable now`} placement="right">
        <UnlockOutlined className={classnames(styles.lockBasis)} />
      </Tooltip>
    )
  }

  return (
    <Tooltip title="Click to acquire permission" placement="right">
      <LockOutlined className={classnames(styles.lockBasis, styles.clickable)} onClick={permissionAcquired} />
    </Tooltip>
  )
}

EditableStatus.propTypes = {
  size: PropTypes.object
}

export default EditableStatus
