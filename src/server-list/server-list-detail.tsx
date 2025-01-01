import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { IPlayer } from './interface';
import { clsPrefix } from '../const';

import './server-list-detail.less';

interface DataType {
  name: string;
  score: number;
  duration: number;
  highlight?: boolean;
}

interface IServerListDetail {
  list: IPlayer[];
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '昵称',
    dataIndex: 'name',
    key: 'name',
    render: (name, record) => record.highlight ? <span className='highlight'>{name}</span> : name
  },
  {
    title: '分数',
    dataIndex: 'score',
    key: 'score',
  },
  {
    title: '游戏时间',
    dataIndex: 'duration',
    key: 'duration',
    render: (duration) => `${(duration/ 60).toFixed(1)}min`
  }
];

const ServerListDetail: React.FC<IServerListDetail> = (props: IServerListDetail) =>
  <Table<DataType>
    columns={columns}
    dataSource={props.list}
    pagination={false}
    size='small'
    className={`${clsPrefix}-server-list-detail`}
  />;

export default ServerListDetail;