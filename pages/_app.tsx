import "../styles/globals.css";
import "../styles/ShareButtons.css";

import "../styles/LoginRegisterModal.css";

import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import { Layout } from "../components";
import { StateContextProvider } from "../context/StateContext";
import { GoogleAnalytics } from "nextjs-google-analytics";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StateContextProvider>
      <Layout>
        <GoogleAnalytics trackPageViews gaMeasurementId="G-Y5VXZ0RDTB" />
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </StateContextProvider>
  );
}

export default MyApp;
