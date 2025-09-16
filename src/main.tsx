import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import SiteHeader from "./components/SiteHeader";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SiteHeader active="shop" />
    <App />
  </React.StrictMode>
);