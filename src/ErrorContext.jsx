import React from "react";

const ErrorContext = React.createContext({
  ErrorText: "",
  SetErrorText: () => {},
});

export default ErrorContext;
