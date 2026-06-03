import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index";
import { AppRouter } from "./routes/AppRouter";
import "./styles/index.css";
import { AuthProvider } from "./AuthProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <Provider store={store}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);
