import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "src/ui/styles/index.css";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { App } from "src/ui/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: "ae80af11-995f-4e0f-b669-ebac1226fd6c",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <App />
    </DynamicContextProvider>
  </StrictMode>,
);
