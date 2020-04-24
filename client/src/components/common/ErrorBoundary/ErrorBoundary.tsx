import React, { Component, ErrorInfo } from 'react';
import ErrorPage from 'pages/ErrorPage/ErrorPage';

class ErrorBoundary extends Component<{}, { hasError: boolean }> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage errorHeading="Oops" errorText="Something get wrong" />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
