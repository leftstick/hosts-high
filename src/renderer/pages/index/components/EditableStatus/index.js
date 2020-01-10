import { Icon, Tooltip } from 'antd'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import usePermissionModel from '@/stores/usePermissionModel'
import { HOSTS } from '@/helpers/os'

import styles from '@/pages/index/components/EditableStatus/index.less'

function EditableStatus() {
  const { acquired, permissionAcquired } = usePermissionModel()

  if (acquired) {
    return (
      <Tooltip title={`${HOSTS} is editable now`} placement="right">
        <Icon className={classnames(styles.lockBasis)} type="unlock" />
      </Tooltip>
    )
  }

  return (
    <Tooltip title="Click to acquire permission" placement="right">
      <Icon className={classnames(styles.lockBasis, styles.clickable)} type="lock" onClick={permissionAcquired} />
    </Tooltip>
  )
}

EditableStatus.propTypes = {
  size: PropTypes.object
}

export default EditableStatus
