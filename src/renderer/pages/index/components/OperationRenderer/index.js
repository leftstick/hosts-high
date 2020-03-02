import { Button } from 'antd'
import PropTypes from 'prop-types'

import { useModel } from 'umi'

import styles from '@/pages/index/components/OperationRenderer/index.less'

function OperationRenderer({ data }) {
  const { acquired } = useModel('usePermissionModel')
  const { toggleHostState, removeHost } = useModel('useHostsModel')

  return (
    <div className={styles.oper}>
      {data.disabled && (
        <Button
          className={styles.enableBtn}
          type="link"
          size="small"
          disabled={!acquired}
          onClick={() => toggleHostState(data)}
        >
          Enable
        </Button>
      )}

      {!data.disabled && (
        <Button
          className={styles.disableBtn}
          type="link"
          size="small"
          disabled={!acquired}
          onClick={() => toggleHostState(data)}
        >
          Disable
        </Button>
      )}
      <Button className={styles.delBtn} type="link" size="small" disabled={!acquired} onClick={() => removeHost(data)}>
        Delete
      </Button>
    </div>
  )
}

OperationRenderer.propTypes = {
  data: PropTypes.shape({
    disabled: PropTypes.bool
  })
}

export default OperationRenderer
