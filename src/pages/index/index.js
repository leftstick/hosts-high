import { useSize } from '@umijs/hooks'

import HostsGrid from '@/pages/index/components/HostsGrid'
import ControlPanel from '@/pages/index/components/ControlPanel'

import styles from '@/pages/index/index.less'

export default () => {
  const [state, ref] = useSize(document.body)
  return (
    <div ref={ref} className={styles.container} style={{ width: `${state.width}px`, height: `${state.height}px` }}>
      <HostsGrid size={{ width: state.width - 40, height: state.height - 75 }} />
      <ControlPanel size={{ width: state.width - 40, height: 60 }} />
    </div>
  )
}
