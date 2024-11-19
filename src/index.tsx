import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

if (window.location.href.includes('debug')) {
  import('vconsole').then((res) => {
    const VConsole = res.default;
    new VConsole();
  })
}
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);
