import React, { Children, ReactElement, useEffect, useState } from 'react';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import BellList from '../asset/bell.png';
import { CustomIcon } from '../component/icon';
import axios from 'axios';


const defaultItems: CollapseProps['items'] = [
  {
    key: '1',
    label: '1',
    children: <p></p>,
  },
  {
    key: '2',
    label: '2',
    children: <p></p>,
  },
  {
    key: '3',
    label: '3',
    children: <p></p>,
  },
];

const Announcement: React.FC = () => {
  const [noticeItems, setNoticeItems] = useState(defaultItems);
  useEffect(() => {
    axios.get('/api/info/changelog').then(res => {
      setNoticeItems(res.data.body.map((notice: { title: string; content: string[] }, index: number) => ({
        key: index + 1,
        label: notice.title,
        children: <pre>{notice.content.join('\n')}</pre>,
      })));
    })
    .catch(e => console.error(e))
  }, []);
  return (
    <Collapse
      items={noticeItems}
      defaultActiveKey={['1', '2', '3']}
      expandIcon={() => <CustomIcon src={BellList}/>}
      ghost
      style={{ userSelect: 'none' }}
    />
  );
};

export default Announcement;