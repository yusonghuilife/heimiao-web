import { Flex, Layout } from 'antd';
import { clsPrefix } from './const';
import HeimiaoHeader from './header';
import HeimiaoServerList from './server-list';
import RankTab from './rank/rank-tab';
import BgVideo from './asset/bg1.mp4';
import BgImg from './asset/bg.png';
import { useLayoutEffect, useRef } from 'react';
import { isMobileDevice } from './utils';

import './App.less';


const { Header, Footer } = Layout;


function App() {
  const sourceRef = useRef<any>(undefined);
  useLayoutEffect(() => {
    if (!isMobileDevice()) {
      if (sourceRef.current) {
        sourceRef.current.src = BgVideo;
      }
    }
  }, []);
  return (
    <>
      <video autoPlay loop muted playsInline poster={BgImg}>
        <source ref={sourceRef} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Flex gap="middle" wrap>
        <Layout className={`${clsPrefix}-layout`}>
          <Header className={`${clsPrefix}-header`}>
            <HeimiaoHeader />
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
