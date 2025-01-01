import { Button, message, Result } from 'antd';
import { Component, ReactNode, ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode; // 可选的回退UI
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // 更新 state 以显示回退 UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 可以在这里记录错误日志
    message.error(`error: ${JSON.stringify(error)}`);
  }

  render() {
    if (this.state.hasError) {
      // 显示回退 UI，如果提供了 fallback，则显示它，否则显示默认消息
      return this.props.fallback || 
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
      />
    }

    return this.props.children;
  }
}

export default ErrorBoundary;