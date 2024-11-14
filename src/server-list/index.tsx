import React, { useCallback, useState } from 'react';
import { Menu } from 'antd';
import { clsPrefix } from '../const';
import { ServerListItems } from './const';
import ServerList from './server-list';
import ErrorBoundary from '../component/error-boundary';

import './index.less';

const HeimiaoServerList: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('all');
  
  // @ts-ignore
  const handleMenuSelect = useCallback(({ item, key, keyPath, selectedKeys, domEvent }) => {
    setActiveMenu(key);
  }, [activeMenu]);

  return (
    <div className={`${clsPrefix}-server`}>
      <ErrorBoundary>
        <Menu
          defaultSelectedKeys={['all']}
          mode="inline"
          items={ServerListItems}
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