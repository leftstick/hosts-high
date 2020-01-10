import { useState, useMemo } from 'react'
import { Input, Table } from 'antd'
import PropTypes from 'prop-types'

import OperationRenderer from '@/pages/index/components/OperationRenderer'
import EditableCell from '@/pages/index/components/EditableCell'
import useHostsModel from '@/stores/useHostsModel'

import styles from '@/pages/index/components/HostsGrid/index.less'

function HostsGrid({ size }) {
  const [searchText, setSearchText] = useState('')
  const { hosts } = useHostsModel()
  const displayHosts = useMemo(() => {
    return hosts.filter(h => {
      if (!searchText) {
        return true
      }
      if (h.alias && h.alias.includes(searchText)) {
        return true
      }
      if (h.ip.includes(searchText)) {
        return true
      }
      if (h.domain.includes(searchText)) {
        return true
      }
      return false
    })
  }, [searchText, hosts])

  const columnDefs = [
    {
      title: 'Ip',
      dataIndex: 'ip',
      width: 200,
      render: (text, record) => <EditableCell record={record} property="ip" />
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      width: 400,
      render: (text, record) => <EditableCell record={record} property="domain" />
    },
    {
      title: 'Alias',
      dataIndex: 'alias',
      render: (text, record) => <EditableCell record={record} property="alias" />
    },
    {
      title: 'Operation',
      width: 150,
      render: (text, record) => <OperationRenderer data={record} />
    }
  ]

  return (
    <div className={styles.grid} style={{ width: `${size.width}px`, height: `${size.height}px` }}>
      <Input
        autoFocus
        placeholder="Type anything to filter..."
        className={styles.searchInput}
        onChange={e => setSearchText(e.target.value)}
      />
      <div
        className="ag-theme-balham"
        style={{ width: `${size.width}px`, height: `${size.height - 32}px`, maxHeight: `${size.height - 32}px` }}
      >
        <Table
          bordered
          scroll={{ y: size.height - 32 - 38 }}
          pagination={false}
          className={styles.dataContainer}
          columns={columnDefs}
          dataSource={displayHosts}
          rowKey={host => host.ip + host.domain}
          size="small"
        />
      </div>
    </div>
  )
}

HostsGrid.propTypes = {
  size: PropTypes.object
}

export default HostsGrid
