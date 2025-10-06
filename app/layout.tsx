import { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: {
    default: 'CogniNote - AI-Powered Note-Taking',
    template: '%s | CogniNote',
  },
  description: 'An AI-powered, multi-document note-taking application',
  robots: {
    follow: true,
    index: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white overflow-x-hidden">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
