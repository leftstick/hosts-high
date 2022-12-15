import { useSize } from 'ahooks';
import { useMemo } from 'react';
import ControlPanel from './components/ControlPanel';
import HostsGrid from './components/HostsGrid';

import styles from './index.less';

const HomePage: React.FC = () => {
  const size = useSize(document.body);

  const { width, height } = useMemo(
    () =>
      size
        ? { width: size.width, height: size.height }
        : { width: 0, height: 0 },
    [size],
  );

  return (
    <div className={styles.container}>
      <HostsGrid size={{ width: width - 40, height: height - 75 }} />
      <ControlPanel size={{ width: width! - 40, height: 60 }} />
    </div>
  );
};

export default HomePage;
