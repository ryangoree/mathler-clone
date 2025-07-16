import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import type { DynamicContextProps } from "@dynamic-labs/sdk-react-core";

export const dynamicSettings: DynamicContextProps["settings"] = {
  environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || "",
  walletConnectors: [EthereumWalletConnectors],
};
