import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Frontend Crash Caught by Boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-deep flex items-center justify-center p-10 text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-serif text-champagne mb-4">Something went wrong.</h1>
            <p className="text-platinum/40 font-sans mb-8">
              The studio encountered an unexpected error. We've logged the details and are looking into it.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-champagne text-slate-deep px-8 py-3 rounded-xl font-bold font-sans hover:scale-105 transition-transform"
            >
              Reload Studio
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-red-500/10 text-red-400 text-xs text-left rounded-xl overflow-auto border border-red-500/20">
                {this.state.error?.toString()}
              </pre>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
