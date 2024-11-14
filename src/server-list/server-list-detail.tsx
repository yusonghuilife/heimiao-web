import React from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { IPlayer } from './interface';
import './server-list-detail.less';
import { clsPrefix } from '../const';

interface DataType {
  name: string;
  score: number;
  duration: number;
}

interface IServerListDetail {
  list: IPlayer[];
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '昵称',
    dataIndex: 'name',
    key: 'name',
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