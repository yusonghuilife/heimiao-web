import { useCallback, useEffect, useState, useRef } from "react";
import { clsPrefix } from "../const";
import Announcement from "./announcement";
import { Avatar, Badge } from "antd";
import NotificationLogo from '../asset/notification.png';
import './index.less';

interface HeaderProps {
  onSwitchBg?: () => void;
  onLockBackground?: () => void;
  disabled?: boolean;
  isLocked?: boolean;
}

const Header = ({ onSwitchBg, onLockBackground, disabled, isLocked }: HeaderProps) => {
  const [announcementShow, setAnnouncementShow] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clickCountRef = useRef(0);

  const handleAnnouncementLogoClick = useCallback(() => {
    setAnnouncementShow((prev) => !prev);
  }, [announcementShow]);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    
    clickCountRef.current += 1;
    
    if (clickCountRef.current === 1) {
      // First click
      clickTimeoutRef.current = setTimeout(() => {
        if (clickCountRef.current === 1) {
          // Single click confirmed
          onSwitchBg?.();
        }
        clickCountRef.current = 0;
      }, 300);
    } else if (clickCountRef.current === 2) {
      // Double click detected
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
      onLockBackground?.();
      clickCountRef.current = 0;
    }
  }, [disabled, onSwitchBg, onLockBackground]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleClickOutSide = useCallback((e: any) => {
    if (announcementShow) {
      if (!document.querySelector(`.${clsPrefix}-header-announcement`)!.contains(e.target) &&
          !document.querySelector(`.${clsPrefix}-header-announcement-logo`)!.contains(e.target)) {
        setAnnouncementShow(false);
      }
    }
  }, [announcementShow]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide);
    };
  }, [announcementShow]);

  return (
    <>
      <div className={`${clsPrefix}-header-announcement-fixed`}>
        <span 
          className={`${clsPrefix}-header-logo`}
          onClick={handleLogoClick} 
          style={{ 
            cursor: disabled ? 'not-allowed' : 'pointer',
            position: 'relative'
          }} 
        />
        <span>欢迎来到黑喵服务器</span>
        <div className={`${clsPrefix}-header-announcement-logo`} onClick={handleAnnouncementLogoClick}>
          <span>更新公告</span>
          <Badge dot={showBadge}>
            <Avatar shape="square" size="small" src={NotificationLogo} />
          </Badge>
        </div>
      </div>
      <div className={`${clsPrefix}-header-announcement ${announcementShow ? 'slide-down' : 'slide-up'}`}>
        <Announcement setBadgeStatus={setShowBadge} announcementShow={announcementShow} />
      </div>
    </>
  );
}

export default Header;