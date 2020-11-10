import React, { ReactElement } from "react";
import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore } from "./redux/store";

function render(ui: ReactElement, { initialState = {} as any, ...renderOptions } = {}) {
  const store = makeStore(initialState);
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper as React.ComponentType, ...renderOptions });
}

// re-export everything
export * from "@testing-library/react";
// override render method
export { render };
