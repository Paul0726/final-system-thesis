import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '20px',
          background: '#E0E2DB',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#1e453e', marginBottom: '20px' }}>Something went wrong</h2>
          <p style={{ color: '#4a4a4a', marginBottom: '30px' }}>
            Please refresh the page to continue.
          </p>
          <button
            onClick={() => {
              window.location.reload();
            }}
            style={{
              padding: '12px 24px',
              background: '#1e453e',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

