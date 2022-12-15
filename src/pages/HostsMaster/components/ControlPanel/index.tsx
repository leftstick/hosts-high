import CreateHost from '../CreateHost';
import EditableStatus from '../EditableStatus';

import { ISize } from '@/IType';

import styles from './index.less';

function ControlPanel({ size }: { size: ISize }) {
  return (
    <div
      className={styles.bar}
      style={{ width: size.width, height: size.height }}
    >
      <div className={styles.barInner}>
        <EditableStatus />
        <CreateHost />
      </div>
    </div>
  );
}

export default ControlPanel;
