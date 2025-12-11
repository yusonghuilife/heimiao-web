import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Tabs, Table, Input, message, Button, Modal } from 'antd';
import type { TabsProps, TableColumnsType, TableProps } from 'antd';
import axios from 'axios';
import {
  ciKillColumns,
  couplesColumns,
  deathColumns,
  headShotColumns,
  incapColumns,
  saveColumns,
  siKillColumns,
  timeColumns,
  expColumns,
  totalColumns,
} from './rank-config';
import UserProfile from '../query-user-data/user-profile';
import { defaultData as defaultUserData, IUserData } from '../query-user-data/data';
import { clsPrefix } from '../../const';
import '../rank-tab.less';
import './rank-2025-table.less';

export type Rank2025Type =
  | 'total2025'
  | 'exp2025'
  | 'time2025'
  | 'couples2025'
  | 'headshots2025'
  | 'si_kill2025'
  | 'ci_kill2025'
  | 'incap2025'
  | 'death2025'
  | 'save2025';

export interface IRank2025DataType {
  rank: number;
  key: React.Key;
  steamid?: string;
  name: string;
  exp?: number;
  rank_title?: string;
  si_kill?: number;
  ci_kill?: number;
  save?: number;
  play_time?: number;
  incap?: number;
  death?: number;
  KDI?: number;
  total_score?: number;
  totalScore?: number;
  mate_name?: string;
  total_exp?: number;
  kills?: number;
  si_hr?: number;
  ci_hr?: number;
}

export const defaultPageSize = 15;

interface IRank2025Config {
  key: Rank2025Type;
  title: string;
  endpoint: string;
  columns: TableColumnsType<IRank2025DataType>;
}

const API_PREFIX = 'http://45.125.45.95:20077';

const rank2025Configs: IRank2025Config[] = [
  {
    key: 'total2025',
    title: '总排名',
    endpoint: `${API_PREFIX}/api/top/total2025`,
    columns: totalColumns as TableColumnsType<IRank2025DataType>,
  },
  {
    key: 'exp2025',
    title: '经验榜',
    endpoint: `${API_PREFIX}/api/top/exp2025`,
    columns: expColumns as TableColumnsType<IRank2025DataType>,
  },
  {
    key: 'time2025',
    title: '陪伴榜',
    endpoint: `${API_PREFIX}/api/top/time2025`,
    columns: timeColumns as TableColumnsType<IRank2025DataType>,
  },
  {
    key: 'couples2025',
    title: '双修榜',
    endpoint: `${API_PREFIX}/api/top/couples2025`,
    columns: couplesColumns as TableColumnsType<IRank2025DataType>,
  },
  {
    key: 'headshots2025',
    title: '爆头榜',
    endpoint: `${API_PREFIX}/api/top/headshots2025`,
    columns: headShotColumns as TableColumnsType<IRank2025DataType>,
  },
  {
    key: 'si_kill2025',
    title: '特感榜',
    endpoint: `${API_PREFIX}/api/top/si_kill2025`,
    columns: siKillColumns as TableColumnsType<IRank2025DataType>,
  },
  {
    key: 'ci_kill2025',
    title: '丧尸榜',
    endpoint: `${API_PREFIX}/api/top/ci_kill2025`,
    columns: ciKillColumns as TableColumnsType<IRank2025DataType>,
  },
  {
    key: 'incap2025',
    title: '倒地榜',
    endpoint: `${API_PREFIX}/api/top/incap2025`,
    columns: incapColumns as TableColumnsType<IRank2025DataType>,
  },
  {
    key: 'death2025',
    title: '死亡榜',
    endpoint: `${API_PREFIX}/api/top/death2025`,
    columns: deathColumns as TableColumnsType<IRank2025DataType>,
  },
  {
    key: 'save2025',
    title: '救人榜',
    endpoint: `${API_PREFIX}/api/top/save2025`,
    columns: saveColumns as TableColumnsType<IRank2025DataType>,
  },
];

const fetchRank2025List = (endpoint: string, start: number, end: number) => {
  return axios.get(`${endpoint}?begin=${start}&end=${end}`);
};

const Rank2025ListTable: React.FC<{ config: IRank2025Config }> = ({ config }) => {
  const { columns, endpoint, key } = config;
  const [data, setData] = useState<IRank2025DataType[]>([]);
  const [loading, setLoading] = useState(false);

  const requestAndUpdateTable = useCallback(
    (params: { start: number; end: number }) => {
      const { start, end } = params;
      setLoading(true);
      fetchRank2025List(endpoint, start, end)
        .then((serverData) => {
          let rank = start;
          const { body } = serverData.data;
          const filled = body.map((user: IRank2025DataType) => ({
            ...user,
            key: user.steamid || `${key}-${++rank}`,
            rank: user.rank || rank,
          }));
          setData(filled);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [endpoint, key],
  );

  useEffect(() => {
    requestAndUpdateTable({
      start: 0,
      end: defaultPageSize,
    });
  }, [requestAndUpdateTable]);

  const handleTableChange: TableProps<IRank2025DataType>['onChange'] = (pagination) => {
    const { current = 0, pageSize = defaultPageSize } = pagination;
    requestAndUpdateTable({
      start: pageSize * (current - 1),
      end: pageSize * current,
    });
  };

  return (
    <Table<IRank2025DataType>
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
    />
  );
};

const generateDynamicColumns = (records: IRank2025DataType[]): TableColumnsType<IRank2025DataType> => {
  if (!records.length) return [];
  const firstRecord = records[0];
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
    mate_name: '搭档',
    total_exp: '总经验',
    kills: '击杀数',
    si_hr: '特感爆头率',
    ci_hr: '普感爆头率',
    total_score: '总分',
  };

  const fieldOrder = [
    'rank',
    'name',
    'mate_name',
    'exp',
    'total_exp',
    'total_score',
    'si_kill',
    'ci_kill',
    'save',
    'kills',
    'play_time',
    'incap',
    'death',
    'KDI',
    'si_hr',
    'ci_hr',
  ];

  const allFields = Object.keys(firstRecord).filter((k) => k !== 'key' && k !== 'steamid');
  const sortedFields = [
    ...fieldOrder.filter((k) => allFields.includes(k)),
    ...allFields.filter((k) => !fieldOrder.includes(k)),
  ];

  return sortedFields.map((key) => {
    const column: any = {
      title: fieldMap[key] || key,
      dataIndex: key,
      key,
    };

    if (['exp', 'si_kill', 'ci_kill', 'save', 'play_time', 'incap', 'death', 'kills', 'total_exp', 'total_score'].includes(key)) {
      column.render = (text: any) => {
        if (text === null || text === undefined) return '-';
        const num = parseFloat(text);
        if (Number.isNaN(num)) return text;
        if (key === 'play_time') {
          const hours = num / 3600;
          return `${hours.toFixed(2)} 小时`;
        }
        return num.toLocaleString();
      };
    }

    if (['si_hr', 'ci_hr'].includes(key)) {
      column.render = (text: any) => `${(parseFloat(text) * 100).toFixed(2)}%`;
    }

    if (key === 'KDI') {
      column.render = (text: any) => parseFloat(text).toFixed(2);
    }

    if (key === 'mate_name') {
      column.render = (_: any, record: IRank2025DataType) => `${record.name}${record.mate_name ? ` / ${record.mate_name}` : ''}`;
    }

    return column;
  });
};

const Rank2025Personal: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<IUserData>(defaultUserData);

  const onSearch = useCallback((value: string) => {
    if (!value) return;
    setLoading(true);
    axios
      .get(`${API_PREFIX}/api/rank2025/name/${value}`)
      .then((res) => {
        if (res.data.status === 'failed') {
          message.error(res.data.message);
          setUserData(defaultUserData);
          return;
        }
        const body = res.data.body;
        const record = Array.isArray(body) ? body[0] : body;
        setUserData(record as IUserData);
      })
      .catch((err) => {
        console.error(err);
        message.error('查询失败，请稍后再试');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Input.Search
        placeholder="输入玩家 steam id 或昵称查询 2025 数据"
        enterButton
        allowClear
        value={inputVal}
        loading={loading}
        onChange={(e) => setInputVal(e.target.value)}
        onSearch={onSearch}
      />
      <div style={{ marginTop: 16 }}>
        <UserProfile data={userData} />
      </div>
    </div>
  );
};

const Rank2025Table: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [topData, setTopData] = useState<IRank2025DataType[]>([]);
  const [topLoading, setTopLoading] = useState(false);

  const totalConfig = rank2025Configs.find((c) => c.key === 'total2025');

  useEffect(() => {
    if (!totalConfig) return;
    setTopLoading(true);
    fetchRank2025List(totalConfig.endpoint, 0, 3)
      .then((res) => {
        let rank = 0;
        const { body } = res.data;
        const filled = body.map((user: IRank2025DataType) => ({
          ...user,
          key: user.steamid || `top-${++rank}`,
          rank: user.rank || rank,
        }));
        setTopData(filled.slice(0, 3));
      })
      .catch((err) => {
        console.error(err);
        message.error('获取总排名失败');
      })
      .finally(() => setTopLoading(false));
  }, [totalConfig]);

  const items: TabsProps['items'] = rank2025Configs
    .map((config) => ({
      key: config.key as string,
      label: config.title,
      children: <Rank2025ListTable config={config} />,
    }))
    .concat([
      {
        key: 'personal2025',
        label: '个人数据',
        children: <Rank2025Personal />,
      },
    ]);

  return (
    <>
      <Table<IRank2025DataType>
        columns={totalColumns as TableColumnsType<IRank2025DataType>}
        dataSource={topData}
        loading={topLoading}
        size="small"
        pagination={{
          defaultCurrent: 1,
          position: ['bottomCenter'],
          total: 3,
          pageSize: 3,
          showSizeChanger: false,
          hideOnSinglePage: true,
        }}
      />
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button type="link" onClick={() => setModalOpen(true)}>
          查看全部
        </Button>
      </div>
      <Modal
        title="2025 排行榜"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={1200}
        className={`${clsPrefix}-2025-rank-modal`}
        style={{ top: 20, maxWidth: 450 }}
        destroyOnClose
        centered
        closable
        maskClosable
      >
        <Tabs
          defaultActiveKey="total2025"
          items={items}
          indicator={{ size: 0 }}
          className={`${clsPrefix}-rank-tab`}
        />
      </Modal>
    </>
  );
};

export default Rank2025Table;

