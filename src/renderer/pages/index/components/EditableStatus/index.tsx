import React from 'react'
import { Tooltip } from 'antd'
import { UnlockOutlined, LockOutlined } from '@ant-design/icons'
import classnames from 'classnames'

import { useModel } from 'umi'
import { HOSTS } from '@/helpers'

import styles from './index.less'

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

export default EditableStatus
