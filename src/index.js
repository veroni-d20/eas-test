import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

const MumbaiEVM = {
  id: 80001,
  name: "Mumbai",
  network: "Mumbai Testnet",
  iconUrl:
    "https://cdn.dorahacks.io/static/files/188c028468557368d12717c46b1bd63e.jpg",
  iconBackground: "#fff",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: {
    public: { http: ["https://polygon-mumbai-bor.publicnode.com"] },
    default: { http: ["https://polygon-mumbai-bor.publicnode.com"] },
  },
  blockExplorers: {
    default: { name: "polygonscan", url: "https://mumbai.polygonscan.com" },
  },
  testnet: true,
};

const { publicClient, chains } = configureChains(
  [MumbaiEVM],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "",
  projectId: "2588db3d04914636093b01d564610991",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </RainbowKitProvider>
  </WagmiConfig>
);
