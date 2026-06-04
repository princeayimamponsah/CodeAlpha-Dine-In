import React from 'react';
import { Button, Card } from './UI';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, errorInfo);
    // Optionally send the error to a logging endpoint here.
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <Card className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-charcoal">Something went wrong</h2>
            <p className="mt-2 text-sm text-softgray">The application encountered an unexpected error. Details are shown below.</p>
            <pre className="mt-4 max-h-48 overflow-auto rounded-md bg-white/70 p-3 text-xs text-charcoal">{String(this.state.error && this.state.error.stack)}</pre>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => window.location.reload()}>Reload</Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>Home</Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
