
import { CustomIcon } from '../component/icon';
import ListAllIcon from '../asset/list_all.png';
import type { MenuProps } from 'antd';

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
];