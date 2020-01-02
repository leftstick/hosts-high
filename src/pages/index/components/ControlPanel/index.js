import PropTypes from 'prop-types'

import EditableStatus from '@/pages/index/components/EditableStatus'
import CreateHost from '@/pages/index/components/CreateHost'

import styles from '@/pages/index/components/ControlPanel/index.less'

function ControlPanel({ size }) {
  return (
    <div className={styles.bar} style={{ width: `${size.width}px`, height: `${size.height}px` }}>
      <div className={styles.barInner}>
        <EditableStatus />
        <CreateHost />
      </div>
    </div>
  )
}

ControlPanel.propTypes = {
  size: PropTypes.object
}

export default ControlPanel
