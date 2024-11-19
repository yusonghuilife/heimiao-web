import React, { useEffect, useState } from 'react';
import type { CollapseProps } from 'antd';
import { Collapse, message } from 'antd';
import BellList from '../asset/bell.png';
import { CustomIcon } from '../component/icon';
import axios from 'axios';
import md5 from 'spark-md5';

let hash = '';
interface IAnnouncementProps {
  setBadgeStatus: (status: boolean) => void;
  announcementShow: boolean;
}

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

const heimiaoNoticeExpire = 'heimiao-notice-update';


const Announcement: React.FC<IAnnouncementProps> = (props: IAnnouncementProps) => {
  const { setBadgeStatus, announcementShow } = props;
  const [noticeItems, setNoticeItems] = useState(defaultItems);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (dataLoaded && announcementShow) {
      // 只要公告展开状态有变化，直接去掉小红点，并且local缓存设置'1'
      setBadgeStatus(false);
      localStorage.setItem(`${heimiaoNoticeExpire}-${hash}`, '1');
    }
  }, [announcementShow, dataLoaded]);

  useEffect(() => {
    setTimeout(() => {
        axios.get('/api/info/changelog').then(res => {
          setDataLoaded(true);
          const noticeDetail = res.data.body;
          setNoticeItems(noticeDetail.map((notice: { title: string; content: string[] }, index: number) => ({
            key: index + 1,
            label: notice.title,
            children: <pre>{notice.content.join('\n')}</pre>,
          })));
          hash = md5.hash(JSON.stringify(noticeDetail));
          try {
            const prevStatus = localStorage.getItem(`${heimiaoNoticeExpire}-${hash}`);
            if (prevStatus) {
              // 证明之前有过
              if (Number(prevStatus)) {
                // 为1代表看过，不需要做什么
              } else {
                // 为0走到这个分支，只需要展示小红点
                setBadgeStatus(true);
              }
            } else {
              // 没找到key，或者内容有变更，设置小红点以及localStorage key
              localStorage.clear();
              setBadgeStatus(true);
              localStorage.setItem(`${heimiaoNoticeExpire}-${hash}`, '0');
            }
          } catch (e) {
            message.error(JSON.stringify(e));
          }
      })
      .catch(e => console.error(e))
    }, 300);
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