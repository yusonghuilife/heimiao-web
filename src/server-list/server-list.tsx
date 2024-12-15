import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Button, Collapse, Input, message, Skeleton } from 'antd';
import axios from 'axios';
import { clsPrefix } from '../const';
import dayjs from 'dayjs';
import { throttle, cloneDeep } from 'lodash-es';

import { IServerInfo, IServerListProps } from './interface';
import ServerListItem from './server-list-item';
import ServerListDetail from './server-list-detail';
import { serverMap } from '.';
import { eventEmitter } from '../utils/event-emitter';

import './server-list.less';

const { Search } = Input;

const getServerItem: (serverList: IServerInfo['server'][], playersList: IServerInfo['players'][]) => CollapseProps['items'] = (serverList, playersList) => {
  return serverList.map((list: IServerInfo['server'], index) => ({
    key: index,
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

  const handleRefresh = useCallback(() => {
    fetchServerList();
    eventEmitter.emit('refresh');
  }, []);

  const fetchServerList = useCallback(throttle(() => {
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
    if (activeTab === 'all') {
      handleSearchClear();
    } else {
      const range = serverMap.get(activeTab);
      try {
        setServerList(serverDataCopy.current.serverList.slice(range![0], range![0] + range!.length));
        setPlayersList(serverDataCopy.current.playersList.slice(range![0], range![0] + range!.length));
      } catch(e) {
        console.error(e);
        message.error('筛选服务器列表出错啦');
      }
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
    const playerRes: IServerInfo['players'][] = [];
    const playersListCopy = cloneDeep(serverDataCopy.current.playersList);
    playersListCopy.map((serverPlayers, serverIndex) => {
      let isHighlight = false;
      serverPlayers.forEach((player) => {
        if (player.name.toLowerCase().includes(inputVal.trim().toLowerCase())) {
          player.highlight = true;
          isHighlight = true;
        }
      });
      if (isHighlight) {
        // push playersList
        playerRes.push(playersListCopy[serverIndex]);
        searchServerIndex.push(serverIndex);
      }
    });
    if (searchServerIndex.length === 0) {
      message.error('未查询到玩家在黑喵服务器中');
      return;
    }
    // push serverList
    const serverRes: IServerInfo['server'][] = [];
    searchServerIndex.map(index => {
      serverRes.push(serverDataCopy.current.serverList[index]);
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
        <Button loading={buttonLoading} onClick={handleRefresh}>刷新</Button>
      </div>
      <Skeleton
        loading={isLoading}
        active
        paragraph={{ rows: 20 }}
      >
        <Collapse
          bordered={false}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          items={getServerItem(serverList, playersList)}
          className={`${clsPrefix}-server-list-content`}
        />
      </Skeleton>
    </>
  );
};

export default ServerList;