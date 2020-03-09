import PropTypes from 'prop-types'

import EditableStatus from '../EditableStatus'
import CreateHost from '../CreateHost'

import styles from './index.less'

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
