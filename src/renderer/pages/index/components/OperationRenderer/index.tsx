import React from 'react'
import { Button } from 'antd'

import { useModel } from 'umi'

import { IHost } from '@/IType'

import styles from './index.less'

function OperationRenderer({ data }: { data: IHost }) {
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

export default OperationRenderer
