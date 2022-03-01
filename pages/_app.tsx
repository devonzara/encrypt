import '../styles/globals.css';
import type { AppProps } from 'next/app';

function EncryptApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default EncryptApp;
