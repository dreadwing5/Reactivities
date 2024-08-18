import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/layout/App";
import "semantic-ui-css/semantic.min.css";
import "./app/layout/styles.css";
import { store, StoreContext } from "./app/stores/store";

createRoot(document.getElementById("root")!).render(
  <StoreContext.Provider value={store}>
    <App />
  </StoreContext.Provider>
);
