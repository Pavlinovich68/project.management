'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@/styles/layout/layout.scss';
import '../styles/pages/code.scss';

interface RootLayoutProps {
   children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
   return (
      <html lang="en" suppressHydrationWarning>
            <head>
               <link id="theme-css" href={`/themes/bootstrap4-dark-blue/theme.css`} rel="stylesheet"></link>
               <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />
            </head>
            <body>
               <PrimeReactProvider>
                  <LayoutProvider>{children}</LayoutProvider>
               </PrimeReactProvider>
            </body>
      </html>
   );
}
