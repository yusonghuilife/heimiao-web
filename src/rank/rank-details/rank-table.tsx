import React, { useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import axios from 'axios';
import { DataType, IRankType } from './rank-config';

export interface IRankTableProps {
  rankType: IRankType;
  columns: TableColumnsType<DataType>
}

export const defaultPageSize = 20;

const fetchRankList = (rankType: IRankType, start: number, end: number) => {
  return axios.get(`/api/top/${rankType}?begin=${start}&end=${end}`)
}

const RankTable: React.FC<IRankTableProps> = (props: IRankTableProps) => {
  const { rankType, columns} = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const requestAndUpdateTable = useCallback((params: { start: number, end: number }) => {
    const { start, end } = params;
    setLoading(true);
    fetchRankList(rankType, start, end)
    .then((serverData) => {
      let rank = start;
      const { body } = serverData.data;
      body.map((user: DataType) => user.key = user.rank = ++rank);
      setData(body);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
    });
  }, [rankType, columns]);

  useEffect(() => {
    requestAndUpdateTable({
      start: 0,
      end: defaultPageSize,
    })
  }, []);

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    const { current = 0, pageSize = defaultPageSize } = pagination;
    requestAndUpdateTable({
      start: pageSize * (current - 1),
      end: pageSize * current,
    });
  };

  return (
    <>
      <Table<DataType> 
        columns={columns}
        dataSource={data}
        loading={loading}
        size="small"
        pagination={{ 
          defaultCurrent: 1,
          position: ['bottomCenter'],
          total: defaultPageSize * 20,
          pageSize: defaultPageSize,
          showSizeChanger: false,
        }}
        onChange={handleTableChange}
        // expandable={{
        //   expandedRowRender: (record) => <UserProfile />,
        //   rowExpandable: () => true,
        //   expandRowByClick: true,
        //   expandIcon: () => null,
        // }}
      />
    </>
  )
};

export default RankTable;