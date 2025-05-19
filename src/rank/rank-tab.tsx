import React from 'react';
import { Tabs } from 'antd';
import type { TableColumnsType, TabsProps } from 'antd';
import RankTable from './rank-details/rank-table';
import { DataType, IRankType, rankMap, rankMapRest } from './rank-details/rank-config';
import { QueryUserInfo } from './query-user-data';
import { clsPrefix } from '../const';
import { useMouseActivity } from '../components/MouseActivityDetector';
import './rank-tab.less';

const personalInfoTab = {
  key: 'personalInfo',
  label: '个人数据',
  children: <QueryUserInfo />,
}

const generateTabList: () => TabsProps['items'] = () => {
  return rankMap.map(rankInfo => ({
    key: rankInfo.name,
    label: rankInfo.title,
    children: <RankTable rankType={rankInfo.name as IRankType} columns={rankInfo.columns as TableColumnsType<DataType>}/>
  })).concat(personalInfoTab).concat(rankMapRest.map(rankInfo => ({
    key: rankInfo.name,
    label: rankInfo.title,
    children: <RankTable rankType={rankInfo.name as IRankType} columns={rankInfo.columns as TableColumnsType<DataType>}/>
  })));
}

const RankTab: React.FC = () => {
  const isActive = useMouseActivity();
  
  return (
    <Tabs
      defaultActiveKey='total'
      items={generateTabList()}
      className={`${clsPrefix}-rank-tab ${!isActive ? 'inactive' : ''}`}
      indicator={{ size: 0 }}
    />
  );
}

export default RankTab;