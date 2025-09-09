
import './globals.css';
import Link from 'next/link';
import { Sidebar } from '../components/Sidebar';
import type { ReactNode } from 'react';
import { StoreProvider } from '../lib/store';

export const metadata = {
  title: 'Multifamily Messaging Demo',
  description: 'Kipsu-style shared inbox, outreach, automations, analytics',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <div className="layout">
            <Sidebar/>
            <main className="main">
              {children}
              <footer>Lake Drive Lofts • Demo only • No real messaging</footer>
            </main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
