import React from "react";

export const createContextStore = (initialState) => {
  const StateContext = React.createContext(initialState);
  const DispatchContext = React.createContext((newState) => {});

  const Provider = ({ children, value = initialState }) => {
    const [state, update] = React.useState(value);

    return (
      <DispatchContext.Provider value={update}>
        <StateContext.Provider value={state}>
          {children}
        </StateContext.Provider>
      </DispatchContext.Provider>
    );
  };

  return {
    State: StateContext,
    DispatchContext,
    Provider
  }
};



