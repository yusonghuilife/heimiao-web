import React, { useCallback, useEffect, useState } from 'react';
import { Table, Modal, Button } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import axios from 'axios';

export interface IRank2025DataType {
  rank: number;
  key: React.Key;
  steamid: string;
  name: string;
  exp: number;
  rank_title: string;
  si_kill: number;
  ci_kill: number;
  save: number;
  play_time: number;
  incap: number;
  death: number;
  KDI: number;
  totalScore?: number;
}

export const defaultPageSize = 20;

const fetchRank2025List = (start: number, end: number) => {
  // 直接请求 heimiao-api 服务器
  return axios.get(`/api/rank2025?start=${start}&end=${end}`)
}

const Rank2025Table: React.FC = () => {
  const [data, setData] = useState<IRank2025DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [allData, setAllData] = useState<IRank2025DataType[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalTotal, setModalTotal] = useState(0);
  const [modalPageSize, setModalPageSize] = useState(50);
  const [modalCurrent, setModalCurrent] = useState(1);

  const requestAndUpdateTable = useCallback((params: { start: number, end: number }) => {
    setLoading(true);
    // 获取前10名数据用于计算
    fetchRank2025List(0, 10)
    .then((serverData) => {
        console.log(serverData);
      const { body } = serverData.data;
      // 格式化数据并计算总分
      const formattedData = body.map((user: any) => ({
        ...user,
        key: user.steamid,
        exp: parseFloat(user.exp),
        si_kill: parseFloat(user.si_kill) || 0,
        save: parseFloat(user.save) || 0,
        totalScore: parseFloat(user.exp) + (parseFloat(user.si_kill) || 0) + (parseFloat(user.save) || 0),
      }));
      
      // 按总分降序排序
      formattedData.sort((a: any, b: any) => b.totalScore - a.totalScore);
      
      // 取前3名并更新排名
      const topThree = formattedData.slice(0, 3).map((user: any, index: number) => ({
        ...user,
        rank: index + 1,
      }));
      
      setData(topThree);
      setTotal(3); // 固定显示3条
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    requestAndUpdateTable({
      start: 0,
      end: 10,
    });
  }, [requestAndUpdateTable]);

  const handleTableChange: TableProps<IRank2025DataType>['onChange'] = (pagination, filters, sorter) => {
    // 只显示前3名，不需要分页
    requestAndUpdateTable({
      start: 0,
      end: 10,
    });
  };

  const requestModalData = useCallback((page: number, pageSize: number) => {
    setModalLoading(true);
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    
    fetchRank2025List(start, end)
      .then((serverData) => {
        const { body } = serverData.data;
        // 格式化数据，按照服务端返回顺序，不排序，不计算总分
        const formattedData = body.map((user: any, index: number) => ({
          ...user,
          key: user.steamid || `${start + index}`,
          rank: start + index + 1, // 根据分页计算排名
        }));
        
        setAllData(formattedData);
        // 如果返回的数据少于请求的数量，说明是最后一页，可以计算总数
        if (body.length < pageSize) {
          setModalTotal(start + body.length);
        } else {
          // 如果返回的数据量等于请求的数量，可能还有更多数据
          // 更新总数为当前页的结束位置 + 1，这样用户可以继续翻页
          const newTotal = start + pageSize;
          if (newTotal > modalTotal) {
            setModalTotal(newTotal);
          }
        }
        setModalLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setModalLoading(false);
      });
  }, []);

  const handleViewAll = () => {
    setModalVisible(true);
    setModalCurrent(1);
    // 初始化时加载第一页数据
    requestModalData(1, modalPageSize);
  };

  const handleModalTableChange: TableProps<IRank2025DataType>['onChange'] = (pagination) => {
    const { current = 1, pageSize = modalPageSize } = pagination;
    setModalCurrent(current);
    setModalPageSize(pageSize);
    requestModalData(current, pageSize);
  };

  const generateColumns = (): TableColumnsType<IRank2025DataType> => {
    if (allData.length === 0) return [];
    
    // 获取第一条数据的所有字段
    const firstRecord = allData[0];
    const columns: TableColumnsType<IRank2025DataType> = [];
    
    // 字段映射表（中文标题）
    const fieldMap: Record<string, string> = {
      rank: '排名',
      name: '昵称',
      exp: '经验值',
      rank_title: '等级称号',
      si_kill: '特感击杀',
      ci_kill: '丧尸击杀',
      save: '救人数',
      play_time: '游戏时长',
      incap: '倒地次数',
      death: '死亡次数',
      KDI: 'KDI',
    };
    
    // 定义字段的显示顺序（重要字段在前），不包含 rank_title 和 steamid
    const fieldOrder = ['rank', 'name', 'exp', 'si_kill', 'ci_kill', 'save', 'play_time', 'incap', 'death', 'KDI'];
    
    // 获取所有实际存在的字段，排除 key、rank_title 和 steamid
    const allFields = Object.keys(firstRecord).filter(key => key !== 'key' && key !== 'rank_title' && key !== 'steamid');
    
    // 按照预定义顺序排序，未定义的字段放在最后
    const sortedFields = [
      ...fieldOrder.filter(key => allFields.includes(key) && key !== 'rank_title' && key !== 'steamid'),
      ...allFields.filter(key => !fieldOrder.includes(key))
    ];
    
    // 遍历所有字段，生成列
    sortedFields.forEach((key) => {
      const column: any = {
        title: fieldMap[key] || key,
        dataIndex: key,
        key: key,
      };
      
      // 对数值字段进行格式化
      if (['exp', 'si_kill', 'ci_kill', 'save', 'play_time', 'incap', 'death', 'KDI'].includes(key)) {
        column.render = (text: any) => {
          if (text === null || text === undefined) return '-';
          const num = parseFloat(text);
          if (isNaN(num)) return text;
          if (key === 'KDI') {
            return num.toFixed(2);
          }
          if (key === 'play_time') {
            // 将游戏时长转换为小时（假设原始单位是秒）
            const hours = num / 3600;
            return hours.toFixed(2) + ' 小时';
          }
          return num.toLocaleString();
        };
      }
      
      columns.push(column);
    });
    
    return columns;
  };

  const columns: TableColumnsType<IRank2025DataType> = [
    {
      title: '排名',
      dataIndex: 'rank',
      width: 80,
    },
    {
      title: '昵称',
      dataIndex: 'name',
    },
    {
      title: '总分',
      dataIndex: 'totalScore',
      render: (text) => parseFloat(text).toFixed(2),
    },
  ];

  return (
    <>
      <Table<IRank2025DataType> 
        columns={columns}
        dataSource={data}
        loading={loading}
        size="small"
        pagination={{ 
          defaultCurrent: 1,
          position: ['bottomCenter'],
          total: 3,
          pageSize: 3,
          showSizeChanger: false,
          hideOnSinglePage: true,
        }}
        onChange={handleTableChange}
      />
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Button type="link" onClick={handleViewAll}>
          查看全部
        </Button>
      </div>
      <Modal
        title="2025排名 - 全部数据"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setAllData([]);
          setModalTotal(0);
          setModalCurrent(1);
        }}
        footer={null}
        width={1200}
        style={{ top: 20 }}
      >
        <Table<IRank2025DataType>
          columns={generateColumns()}
          dataSource={allData}
          loading={modalLoading}
          size="small"
          className="rank-2025-table-modal-history"
          scroll={{ x: 'max-content', y: 600 }}
          pagination={{
            current: modalCurrent,
            position: ['bottomCenter'],
            pageSize: modalPageSize,
            total: modalTotal,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            pageSizeOptions: ['20', '50', '100', '200'],
          }}
          onChange={handleModalTableChange}
        />
      </Modal>
    </>
  )
};

export default Rank2025Table;

