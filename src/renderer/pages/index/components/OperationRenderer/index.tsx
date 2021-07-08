import React from 'react'
import { Tooltip } from 'antd'
import { DeleteOutlined, PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'

import { useModel } from 'umi'

import { IHost } from '@/IType'

import styles from './index.less'

function OperationRenderer({ data }: { data: IHost }) {
  const { acquired } = useModel('usePermissionModel')
  const { toggleHostState, removeHost } = useModel('useHostsModel')

  return (
    <div className={styles.oper}>
      {!data.disabled && (
        <Tooltip
          title="Click to disable this rule"
          getPopupContainer={(e) => e.parentElement!}
          overlayStyle={{ width: 170 }}
        >
          <PauseCircleOutlined className={styles.pauseBtn} disabled={!acquired} onClick={() => toggleHostState(data)} />
        </Tooltip>
      )}
      {data.disabled && (
        <Tooltip
          title="Click to enable this rule"
          getPopupContainer={(e) => e.parentElement!}
          overlayStyle={{ width: 170 }}
        >
          <PlayCircleOutlined className={styles.enableBtn} disabled={!acquired} onClick={() => toggleHostState(data)} />
        </Tooltip>
      )}
      <Tooltip
        title="Click to delete this rule"
        getPopupContainer={(e) => e.parentElement!}
        overlayStyle={{ width: 165 }}
      >
        <DeleteOutlined
          style={{ marginLeft: 15 }}
          className={styles.delBtn}
          disabled={!acquired}
          onClick={() => removeHost(data)}
        />
      </Tooltip>
    </div>
  )
}

export default OperationRenderer
