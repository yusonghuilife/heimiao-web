import React, { useCallback, useEffect, useState } from 'react';
import { Menu, message } from 'antd';
import { clsPrefix } from '../const';
import { ServerListItems } from './const';
import ServerList from './server-list';
import ErrorBoundary from '../component/error-boundary';
import ListAllIcon from '../asset/list_all.png';
import { CustomIcon } from '../component/icon';
import './index.less';

export const serverMap = new Map<string, Array<number>>();

const HeimiaoServerList: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('all');
  const [menuInfo, setMenuInfo] = useState(ServerListItems);
  
  // @ts-ignore
  const handleMenuSelect = useCallback(({ item, key, keyPath, selectedKeys, domEvent }) => {
    setActiveMenu(key);
  }, [activeMenu]);

  useEffect(() => {
    fetch(`/server-category.txt?ts=${Date.now()}`)
      .then(res => res.text())
      .then(res => {
        const newServerListItems = ServerListItems.slice();
        const serverInfo = res.split('\n');
        serverInfo.map((info: string) => {
          if (info.length > 0) {
            const [key, name, rangeStr] = info.split('_');
            const range = rangeStr.split(' ').map(num => Number(num));
            serverMap.set(key, range);
            newServerListItems.push({
              key,
              label: name,
              icon: <CustomIcon src={ListAllIcon} />,
            }, {
              type: 'divider',
            })
            setMenuInfo(newServerListItems);
          }
        });
      }).catch(e =>  {
        console.error(e);
        message.error(JSON.stringify(e));
      })
  }, [])

  return (
    <div className={`${clsPrefix}-server`}>
      <ErrorBoundary>
        <Menu
          defaultSelectedKeys={['all']}
          mode="inline"
          items={menuInfo}
          className={`${clsPrefix}-server-menu`}
          onSelect={handleMenuSelect}
          selectedKeys={[activeMenu]}
        />
        <div className={`${clsPrefix}-server-list`}>
          <ServerList activeTab={activeMenu} />
        </div>
      </ErrorBoundary>
    </div>
    
  )
}

export default HeimiaoServerList;