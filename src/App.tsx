import { useRef, useState, useCallback, useEffect } from 'react';
import { Flex, Layout, message } from 'antd';
import { clsPrefix } from './const';
import HeimiaoHeader from './header';
import HeimiaoServerList from './server-list';
import RankTab from './rank/rank-tab';
// mp4 bg list  start
import BgVideo from './asset/bg/bg.mp4';
import Bg1Video from './asset/bg/bg1.mp4';
import Bg2Video from './asset/bg/bg2.mp4';
import Bg3Video from './asset/bg/bg3.mp4';
import Bg4Video from './asset/bg/bg4.mp4';

// fallback img for mobile
import BgImg from './asset/bg/bg.png';

import { isMobileDevice } from './utils';
import './App.less';

const { Header, Footer } = Layout;

// 定义背景视频列表及其对应的概率
const bgVideoList = [
  { src: BgVideo, probability: 0.35 },
  { src: Bg1Video, probability: 0.25 },
  { src: Bg2Video, probability: 0.20 },
  { src: Bg3Video, probability: 0.10 },
  { src: Bg4Video, probability: 0.10 }
];

// 根据概率随机选择一个视频索引
function getRandomVideoIndex() {
  const rand = Math.random();
  let cumulativeProbability = 0;
  for (let i = 0; i < bgVideoList.length; i++) {
    cumulativeProbability += bgVideoList[i].probability;
    if (rand < cumulativeProbability) {
      return i;
    }
  }
  return 0;
}

const STORAGE_KEY = 'heimiao_locked_bg_index';

function App() {
  // Get initial video index from localStorage or random
  const getInitialVideoIndex = () => {
    const storedIndex = localStorage.getItem(STORAGE_KEY);
    if (storedIndex !== null) {
      const index = parseInt(storedIndex, 10);
      if (index >= 0 && index < bgVideoList.length) {
        return index;
      }
    }
    return getRandomVideoIndex();
  };

  const [bgVideoIndex, setBgVideoIndex] = useState(() => getInitialVideoIndex());
  const [nextVideoIndex, setNextVideoIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeVideo, setActiveVideo] = useState<'first' | 'second'>('first');
  const [isLocked, setIsLocked] = useState(() => localStorage.getItem(STORAGE_KEY) !== null);
  const firstVideoRef = useRef<HTMLVideoElement>(null);
  const secondVideoRef = useRef<HTMLVideoElement>(null);
  const [isMouseInWindow, setIsMouseInWindow] = useState(true);
  const [isMouseTimeoutActive, setIsMouseTimeoutActive] = useState(false);
  const mouseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouseLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentBgVideo = bgVideoList[bgVideoIndex].src;
  const nextBgVideo = nextVideoIndex !== null ? bgVideoList[nextVideoIndex].src : currentBgVideo;

  // 计算两个视频应该显示的源
  const getVideoSrc = (isFirst: boolean) => {
    if (isFirst) {
      return activeVideo === 'first' ? currentBgVideo : nextBgVideo;
    } else {
      return activeVideo === 'second' ? currentBgVideo : nextBgVideo;
    }
  };

  const handleSwitchBg = useCallback(() => {
    if (isLoading || isMobileDevice()) return;
    const nextIndex = (bgVideoIndex + 1) % bgVideoList.length;
    setNextVideoIndex(nextIndex);
    setIsLoading(true);
  }, [bgVideoIndex, isLoading]);

  const handleLockBackground = useCallback(() => {
    if (isLocked) {
      localStorage.removeItem(STORAGE_KEY);
      setIsLocked(false);
      message.success('已解锁背景切换');
    } else {
      localStorage.setItem(STORAGE_KEY, bgVideoIndex.toString());
      setIsLocked(true);
      message.success('已锁定当前背景');
    }
  }, [bgVideoIndex, isLocked]);

  // 监听新视频加载完成
  useEffect(() => {
    if (nextVideoIndex === null) return;

    const currentVideo = activeVideo === 'first' ? firstVideoRef.current : secondVideoRef.current;
    const nextVideo = activeVideo === 'first' ? secondVideoRef.current : firstVideoRef.current;

    if (!nextVideo) return;

    const handleCanPlay = () => {
      if (nextVideo.readyState >= 3) {
        nextVideo.style.opacity = '1';
        setTimeout(() => {
          setBgVideoIndex(nextVideoIndex);
          setNextVideoIndex(null);
          setIsLoading(false);
          setActiveVideo(activeVideo === 'first' ? 'second' : 'first');
        }, 100);
      }
    };

    nextVideo.addEventListener('canplay', handleCanPlay);
    return () => {
      nextVideo.removeEventListener('canplay', handleCanPlay);
    };
  }, [nextVideoIndex, activeVideo]);

  // Add mouse presence handlers
  useEffect(() => {
    const handleMouseEnter = () => {
      setIsMouseInWindow(true);
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
        mouseLeaveTimeoutRef.current = null;
      }
      mouseTimeoutRef.current = setTimeout(() => {
        setIsMouseTimeoutActive(false);
        const currentActiveVideo = activeVideo === 'first' ? firstVideoRef.current : secondVideoRef.current;
        if (currentActiveVideo) {
          currentActiveVideo.play().catch((error: Error) => {
            console.warn('Failed to resume video playback:', error);
          });
        }
      }, 3000);
    };

    const handleMouseLeave = () => {
      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
      }
      mouseLeaveTimeoutRef.current = setTimeout(() => {
        setIsMouseInWindow(false);
        setIsMouseTimeoutActive(true);
        const videos = [firstVideoRef.current, secondVideoRef.current];
        videos.forEach(video => {
          if (video) {
            video.pause();
          }
        });
      }, 3000);
    };

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (mouseTimeoutRef.current) {
        clearTimeout(mouseTimeoutRef.current);
      }
      if (mouseLeaveTimeoutRef.current) {
        clearTimeout(mouseLeaveTimeoutRef.current);
      }
    };
  }, [activeVideo]);

  // Modify visibility change handler to respect mouse presence
  useEffect(() => {
    const handleVisibilityChange = () => {
      const videos = [firstVideoRef.current, secondVideoRef.current];
      if (document.hidden || !isMouseInWindow || isMouseTimeoutActive) {
        // Pause all videos when page is hidden or mouse is out
        videos.forEach(video => {
          if (video) {
            video.pause();
          }
        });
      } else {
        // Resume active video when page becomes visible and mouse is in
        const currentActiveVideo = activeVideo === 'first' ? firstVideoRef.current : secondVideoRef.current;
        if (currentActiveVideo) {
          currentActiveVideo.play().catch((error: Error) => {
            console.warn('Failed to resume video playback:', error);
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeVideo, isMouseInWindow, isMouseTimeoutActive]);

  return (
    <>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}>
        {
          !isMobileDevice() ?
          <>
            <video
              ref={firstVideoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              src={getVideoSrc(true)}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // transition: 'opacity 0.5s ease-in-out',
                opacity: activeVideo === 'first' ? 1 : 0
              }}
            />
            <video
              ref={secondVideoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              src={getVideoSrc(false)}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                // transition: 'opacity 0.5s ease-in-out',
                opacity: activeVideo === 'second' ? 1 : 0
              }}
            />
          </>
          : <video poster={BgImg} />
        }
      </div>
      <Flex gap="middle" wrap>
        <Layout className={`${clsPrefix}-layout`}>
          <Header className={`${clsPrefix}-header`}>
            <HeimiaoHeader 
              onSwitchBg={handleSwitchBg} 
              onLockBackground={handleLockBackground}
              disabled={isLoading} 
              isLocked={isLocked}
            />
          </Header>
          <Layout className={`${clsPrefix}-container`}>
            <HeimiaoServerList />
            <RankTab />
          </Layout>
          <Footer className={`${clsPrefix}-footer`}>
            <div id="beian"><a href="https://beian.miit.gov.cn/" target="_blank">豫ICP备2023012652号-1</a></div>
          </Footer>
        </Layout>
      </Flex>
    </>
  );
}

export default App;
