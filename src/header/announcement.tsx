import React, { useCallback, useEffect, useState } from 'react';
import type { CollapseProps } from 'antd';
import { Collapse, message } from 'antd';
import axios from 'axios';
import md5 from 'spark-md5';
import { eventEmitter } from '../utils/event-emitter';

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

  const fetchAnnouncement = useCallback(() => {
    setTimeout(() => {
    axios.get('/api/info/changelog').then(res => {
      setDataLoaded(true);
      const noticeDetail = res.data.body.reverse();
      setNoticeItems(noticeDetail.map((notice: { title: string; content: string[] }, index: number) => ({
        key: index + 1,
        label: notice.title,
        children: (
          <pre style={{ 
            whiteSpace: 'pre-wrap',       // 保留空格和换行符，但会自动换行
            wordWrap: 'break-word',       // 允许长单词断行
            maxWidth: '100%'              // 确保不会超出容器
          }}>
            {notice.content.join('\n')}
          </pre>
        ),
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
      }).catch(e => console.error(e));
    }, 300);
  }, []);

  useEffect(() => {
    // 初始化时获取公告
    fetchAnnouncement();
    // 监听刷新事件
    eventEmitter.on('refresh', fetchAnnouncement);
    return () => {
      // 清理事件监听
      eventEmitter.off('refresh', fetchAnnouncement);
    };
  }, []);

  return (
    <Collapse
      items={noticeItems}
      defaultActiveKey={['1']}
      ghost
      style={{ userSelect: 'none' }}
    />
  );
};

export default Announcement;