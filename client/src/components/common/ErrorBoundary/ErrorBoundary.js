import React, { Component } from 'react';
import ErrorPage from 'pages/ErrorPage/ErrorPage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      console.log('error is happendedd', this.state);
      return <ErrorPage errorHeading="Oops" errorText="Something get wrong" />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
