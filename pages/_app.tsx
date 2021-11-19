import "../styles/globals.css";
import type { AppProps } from "next/app";
import "../firebase/config";
import { AuthProvider } from "../firebase/auth/hook/auth";
import AuthStateChanged from "../firebase/auth/layout/AuthStateChanged";

function MyApp({ Component, pageProps: { ...pageProps } }: AppProps) {
  return (
    <AuthProvider>
      <AuthStateChanged>
        <Component {...pageProps} />
      </AuthStateChanged>
    </AuthProvider>
  );
}

export default MyApp;
