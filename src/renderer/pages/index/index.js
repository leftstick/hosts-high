import { useSize } from '@umijs/hooks'

import HostsGrid from './components/HostsGrid'
import ControlPanel from './components/ControlPanel'

import styles from './index.less'

export default () => {
  const [state, ref] = useSize(document.body)
  return (
    <div ref={ref} className={styles.container} style={{ width: `${state.width}px`, height: `${state.height}px` }}>
      <HostsGrid size={{ width: state.width - 40, height: state.height - 75 }} />
      <ControlPanel size={{ width: state.width - 40, height: 60 }} />
    </div>
  )
}
