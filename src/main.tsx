import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "src/ui/styles/index.css";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { dynamicSettings } from "src/lib/dynamic";
import { queryClient } from "src/lib/react-query";
import { App } from "src/ui/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DynamicContextProvider settings={dynamicSettings}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </DynamicContextProvider>
  </StrictMode>,
);
