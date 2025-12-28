import React from 'react';
import Head from 'next/head';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Tasker' }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Head>
                <title>{title}</title>
            </Head>

            <header style={{
                padding: '1.5rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-primary)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
                borderBottom: '1px solid var(--bg-secondary)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/icons/icon-192x192.png" alt="Logo" style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                    <h1 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        letterSpacing: '-0.5px',
                        color: 'var(--text-primary)'
                    }}>
                        Tasker
                    </h1>
                </div>
                <nav style={{ display: 'flex', gap: '1rem' }}>
                    <a href="/" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.2rem' }}>🏠</a>
                    <a href="/leaderboard" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontSize: '1.2rem' }}>🏆</a>
                </nav>
            </header>

            <main style={{ flex: 1, padding: '1.5rem 1rem', maxWidth: '600px', margin: '0 auto', width: '100%' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
