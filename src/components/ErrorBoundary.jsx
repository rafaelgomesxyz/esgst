import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  componentDidCatch(error, info) {
    console.log(error, info);
    this.setState({hasError: true});
  }

  render() {
    let content;
    if (this.state.hasError) {
      content = <p>Something went wrong.</p>;
    } else {
      content = this.props.children;
    }
    return content;
  }
}

export {ErrorBoundary};