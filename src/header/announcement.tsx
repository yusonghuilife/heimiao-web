import React, { useEffect } from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import BellList from '../asset/bell.png';
import { CustomIcon } from '../component/icon';
import axios from 'axios';

const text = '';

const items: CollapseProps['items'] = [
  {
    key: '1',
    label: '2024/11/12 更新公告',
    children: <p>{text}</p>,
  },
  {
    key: '2',
    label: '2024/11/11 更新公告',
    children: <p>{text}</p>,
  },
  {
    key: '3',
    label: '2024/11/10 更新公告',
    children: <p>{text}</p>,
  },
];

const Announcement: React.FC = () => {
  // useEffect(() => {
  //   axios.get('/api/info/changelog').then(res => {

  //   })
  //   .catch(e => console.error(e))
  //   .finally(() => {

  //   });
  // }, []);
  return (
    <Collapse
      items={items}
      defaultActiveKey={['1', '2', '3']}
      expandIcon={() => <CustomIcon src={BellList}/>}
      ghost
      style={{ userSelect: 'none' }}
    />
  );
};

export default Announcement;