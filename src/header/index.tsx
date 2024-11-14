import { useCallback, useState } from "react";
import { clsPrefix } from "../const";
import Announcement from "./announcement";
import { Badge, Avatar } from "antd";
import NotificationLogo from '../asset/notification.png';
import './index.less';

const Header = () => {
  const [announcementShow, setAnnouncementShow] = useState(false);
  const handleAnnouncementLogoClick = useCallback(() => {
    setAnnouncementShow(!announcementShow);
  }, [announcementShow]);
  return (
    <>
      <div className={`${clsPrefix}-header-announcement-fixed`}>
        <span className={`${clsPrefix}-header-logo`}>
        </span>
        <span>欢迎来到黑喵服务器</span>
        <div className={`${clsPrefix}-header-announcement-logo`} onClick={handleAnnouncementLogoClick}>
          <span>更新公告</span>
          <Avatar shape="square" size="small" src={NotificationLogo} />
        </div>
      </div>
      <div className={`${clsPrefix}-header-announcement ${announcementShow ? 'slide-down' : 'slide-up'}`}>
        <Announcement />
      </div>
    </>
  )
}
export default Header;