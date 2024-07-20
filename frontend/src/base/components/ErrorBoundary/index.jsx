
import React from 'react';
import PropTypes from 'prop-types';

import Fallback from './components/Fallback';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null};
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.errorInfo) {
      return <Fallback />
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;

ErrorBoundary.propTypes = {
  children: PropTypes.any
}