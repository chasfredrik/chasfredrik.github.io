import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log("An unhandled error occurred,", error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h4>H&auml;r &auml;r det tyv&auml;rr lite trasigt</h4>;
    }

    return this.props.children;
  }
}
