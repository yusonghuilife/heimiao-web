import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Button, Collapse, Input, message, Skeleton } from 'antd';
import axios from 'axios';
import { clsPrefix } from '../const';
import dayjs from 'dayjs';
import { throttle } from 'lodash-es';

import { IServerInfo, IServerListProps } from './interface';
import ServerListItem from './server-list-item';
import ServerListDetail from './server-list-detail';

import './server-list.less';

const { Search } = Input;

const getServerItem: (serverList: IServerInfo['server'][], playersList: IServerInfo['players'][]) => CollapseProps['items'] = (serverList, playersList) => {
  return serverList.map((list: IServerInfo['server'], index) => ({
    key: list.name,
    label: <ServerListItem {...list} />,
    children: <ServerListDetail list={playersList[index]} />,
    showArrow: false,
    style: { border: 'none' },
  }));
}

const ServerList: React.FC<IServerListProps> = (props: IServerListProps) => {
  const { activeTab } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [serverList, setServerList] = useState<IServerInfo['server'][]>([]);
  const [playersList, setPlayersList] = useState<IServerInfo['players'][]>([]);
  const serverDataCopy = useRef({
    serverList,
    playersList,
  });

  const fetchServerList = useCallback(throttle(() => {
    console.log('111')
    setButtonLoading(true);
    axios.get('/api/all')
    .then((serverData) => {
      const { result } = serverData.data.body;
      const serverList: IServerInfo['server'][] = [];
      const playersList: IServerInfo['players'][] = [];
      result.map((item: IServerInfo) => {
        serverList.push(item.server);
        playersList.push(item.players);
      });
      setServerList(serverList);
      setPlayersList(playersList);
      // 每次重新拉数据的时候保存副本
      serverDataCopy.current = {
        serverList,
        playersList,
      };
    }).catch((err) => {
      message.error(err);
    }).finally(() => {
      setIsLoading(false);
      setButtonLoading(false);
    });
  }, 1500), []);

  useEffect(() => {
    fetchServerList();
  }, []);

  useEffect(() => {
    // 先清空下search内容
    setInputVal('');
    switch (activeTab) {
      case 'all':
        handleSearchClear();
        break;
      case 'multi':
        // 多人多特服务器
        setServerList(serverDataCopy.current.serverList.slice(0, 5));
        setPlayersList(serverDataCopy.current.playersList.slice(0, 5));
        break;
      case 'third-party':
        // 三方多特服务器
        setServerList(serverDataCopy.current.serverList.slice(5, 12));
        setPlayersList(serverDataCopy.current.playersList.slice(5, 12));
        break;
      case 'infinite':
        // 无限火力服务器
        setServerList(serverDataCopy.current.serverList.slice(12, 21));
        setPlayersList(serverDataCopy.current.playersList.slice(12, 21));
        break;
      case 'master':
        // 写实专家服务器
        setServerList(serverDataCopy.current.serverList.slice(21, 23));
        setPlayersList(serverDataCopy.current.playersList.slice(21, 23));
        break;
      default:
        break;
    }

    // 防止数据没拉回来之前做筛选不进入更新逻辑
  }, [activeTab, isLoading, buttonLoading]);

  // @ts-ignore
  const searchResult = useCallback((value, event, info) => {
    // 没有输入 / 点击clear / 服务器列表数据没回来之前不能搜索
    if (inputVal.length === 0
      || info.source === 'clear'
      || serverList.length === 0) {
      return;
    }
    let searchServerIndex: number[] = [];
    serverDataCopy.current.playersList.map((serverPlayers, serverIndex) => {
      if (serverPlayers.some(player => (player.name.toLowerCase()).includes(inputVal.trim().toLowerCase()))) {
        searchServerIndex.push(serverIndex);
      }
    });
    if (searchServerIndex.length === 0) {
      message.error('未查询到玩家在黑喵服务器中');
      return;
    }
    const serverRes: IServerInfo['server'][] = [];
    const playerRes: IServerInfo['players'][] = [];
    searchServerIndex.map(index => {
      serverRes.push(serverDataCopy.current.serverList[index]);
      playerRes.push(serverDataCopy.current.playersList[index]);
    });
    setServerList(serverRes);
    setPlayersList(playerRes);
  }, [inputVal]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
  }, [inputVal]);

  const handleSearchClear = useCallback(() => {
    // 将数据还原
    setServerList(serverDataCopy.current.serverList);
    setPlayersList(serverDataCopy.current.playersList);
  }, [serverDataCopy.current]);

  return (
    <>
      <div className={`${clsPrefix}-server-list-header`}>
        <span>查询时间:{dayjs().format('YYYY/MM/DD HH:mm:ss')}</span>
        <span>玩家总数:{serverDataCopy.current.playersList.flat().length}</span>
        <Search
          placeholder="搜索当前服务器内玩家"
          className={`${clsPrefix}-server-list-header-search`}
          allowClear
          onChange={handleInputChange}
          onSearch={searchResult}
          onClear={handleSearchClear}
          value={inputVal}
        />
        <Button loading={buttonLoading} onClick={fetchServerList}>刷新</Button>
      </div>
      <Skeleton
        loading={isLoading}
        active
        paragraph={{ rows: 20 }}
      >
        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          items={getServerItem(serverList, playersList)}
          className={`${clsPrefix}-server-list-content`}
        />
      </Skeleton>
    </>
  );
};

export default ServerList;