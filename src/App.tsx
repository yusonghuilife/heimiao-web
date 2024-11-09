import React from 'react';
import mainBgImg from './asset/gril_background.jpg'
// import logo from './logo.svg';
import './App.css';
import { Flex, Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const clsPrefix = 'heimiao'

const headerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 48,
  lineHeight: '64px',
  backgroundColor: 'transparent',
};

const contentStyle: React.CSSProperties = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: 'transparent',
};

const siderStyle: React.CSSProperties = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: 'rgba(255, 255, 255, 0.4)',
};

const footerStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: 'transparent',
};

const layoutStyle: React.CSSProperties = {
  borderRadius: 8,
  overflow: 'hidden',
  width: '100vw',
  height: '100vh',
  backgroundImage: `url(${mainBgImg})`,
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat', /* 防止图片重复 */
  backgroundSize: 'auto',
};

function App() {
  return (
    <Flex gap="middle" wrap>
      <Layout className={`${clsPrefix}-layout`} style={layoutStyle}>
        <Header className={`${clsPrefix}-header`} style={headerStyle}>Banner</Header>
        <Layout className={`${clsPrefix}-container`}>
          <Content className={`${clsPrefix}-server-list`}style={contentStyle}>Content</Content>
          <Sider className={`${clsPrefix}-rank-list`} width="25%" style={siderStyle}>
            Sider
          </Sider>
        </Layout>
        <Footer className={`${clsPrefix}-footer`} style={footerStyle}>Footer</Footer>
      </Layout>
    </Flex>
  );
}

export default App;
