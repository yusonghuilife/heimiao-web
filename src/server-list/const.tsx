import type { MenuProps } from 'antd';

import { CustomIcon } from '../component/icon';
import ListAllIcon from '../asset/list_all.png';

type MenuItem = Required<MenuProps>['items'][number];

export const ServerListItems: MenuItem[] = [
  {
    key: 'all',
    label: '全部服务器',
    icon: <CustomIcon src={ListAllIcon} />,
  },
   {
    type: 'divider',
  },
  {
    key: 'multi',
    label: '多人多特',
    icon: <CustomIcon src={ListAllIcon} />,
  },
  {
    type: 'divider',
  },
  {
    key: 'third-party',
    label: '三方多特',
    icon: <CustomIcon src={ListAllIcon} />,
  },
  {
    type: 'divider',
  },
  {
    key: 'infinite',
    label: '无限火力',
    icon: <CustomIcon src={ListAllIcon} />,
  },
  {
    type: 'divider',
  },
  {
    key: 'master',
    label: '写实专家',
    icon: <CustomIcon src={ListAllIcon} />,
  },
];