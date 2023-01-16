import { Input, Table } from 'antd';
import { useMemo, useState } from 'react';

import { useModel } from '@umijs/max';

import { IHost, ISize } from '@/IType';
import EditableCell from '../EditableCell';
import OperationRenderer from '../OperationRenderer';

import styles from './index.less';

function HostsGrid({ size }: { size: ISize }) {
  const [searchText, setSearchText] = useState('');
  const { hosts } = useModel('useHostsModel');
  const finalHosts = useMemo(() => {
    return hosts.filter((h) => {
      if (h.invalid) {
        return false;
      }
      if (!searchText) {
        return true;
      }
      if (h.alias && h.alias.includes(searchText)) {
        return true;
      }
      if (h.ip.includes(searchText)) {
        return true;
      }
      if (h.domain.includes(searchText)) {
        return true;
      }
      return false;
    });
  }, [searchText, hosts]);

  const columnDefs = [
    {
      title: 'Ip',
      dataIndex: 'ip',
      width: 160,
      render: (text: string, record: IHost) => (
        <EditableCell record={record} property="ip" />
      ),
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      render: (text: string, record: IHost) => (
        <EditableCell record={record} property="domain" />
      ),
    },
    {
      title: 'Alias',
      dataIndex: 'alias',
      width: 120,
      render: (text: string, record: IHost) => (
        <EditableCell record={record} property="alias" />
      ),
    },
    {
      title: 'Action',
      width: 90,
      render: (text: string, record: IHost) => (
        <OperationRenderer data={record} />
      ),
    },
  ];

  return (
    <div
      className={styles.grid}
      style={{ width: size.width, height: size.height }}
    >
      <Input
        autoFocus
        placeholder="Type anything to filter..."
        className={styles.searchInput}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <div
        className="ag-theme-balham"
        style={{
          width: size.width,
          height: size.height - 32,
          maxHeight: size.height - 32,
        }}
      >
        <Table
          bordered
          scroll={{ y: size.height - 80 }}
          pagination={false}
          className={styles.dataContainer}
          columns={columnDefs}
          dataSource={finalHosts}
          rowKey={(host) => host.ip + host.domain}
          size="small"
        />
      </div>
    </div>
  );
}

export default HostsGrid;
