import React from 'react'
import { useSize } from '@umijs/hooks'

import HostsGrid from './components/HostsGrid'
import ControlPanel from './components/ControlPanel'

import styles from './index.less'

export default () => {
  const [state] = useSize(document.body)
  const { width, height } = state
  return (
    <div className={styles.container} style={{ width, height }}>
      <HostsGrid size={{ width: width! - 40, height: height! - 75 }} />
      <ControlPanel size={{ width: width! - 40, height: 60 }} />
    </div>
  )
}
