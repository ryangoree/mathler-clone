import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import type { DynamicContextProps } from "@dynamic-labs/sdk-react-core";

export const dynamicSettings: DynamicContextProps["settings"] = {
  environmentId: "ae80af11-995f-4e0f-b669-ebac1226fd6c",
  walletConnectors: [EthereumWalletConnectors],
};
