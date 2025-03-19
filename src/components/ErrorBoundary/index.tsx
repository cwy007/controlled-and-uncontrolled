import React from 'react'

class ErrorBoundary extends React.Component {
  state: { hasError: boolean; message?: string }
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. {this.state.message}</h1>
    }

    return this.props.children
  }
}

export default ErrorBoundary