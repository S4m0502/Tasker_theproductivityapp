import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { GameProvider } from '../lib/store';

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <GameProvider>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
                <title>Discipline RPG</title>
                <meta name="description" content="Daily Survival RPG" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#050505" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            </Head>
            <Component {...pageProps} />
        </GameProvider>
    );
}

export default MyApp;
