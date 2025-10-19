import { clsx } from 'clsx';
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import Providers from './providers';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: 'Todo List App - Manage Your Tasks',
  description:
    'A modern, feature-rich todo list application built with Next.js, NextAuth.js, and Vercel Postgres.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={clsx(montserrat.variable, 'antialiased')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
