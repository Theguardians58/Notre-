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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Check Firebase configuration on load
              (function() {
                const requiredVars = [
                  'NEXT_PUBLIC_BACKEND',
                  'NEXT_PUBLIC_FIREBASE_API_KEY',
                  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
                  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
                  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
                  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
                  'NEXT_PUBLIC_FIREBASE_APP_ID'
                ];
                
                const missing = requiredVars.filter(v => !window['_env_'] || !window['_env_'][v]);
                
                if (missing.length > 0 && '${process.env.NEXT_PUBLIC_BACKEND}' === 'firebase') {
                  console.error('%c⚠️ Configuration Error', 'color: red; font-size: 16px; font-weight: bold;');
                  console.error('%cMissing environment variables:', 'color: orange; font-size: 14px;');
                  missing.forEach(v => console.error('  -', v));
                  console.error('%c📚 Fix: See FIX_FIREBASE_API_KEY_ERROR.md', 'color: blue; font-size: 12px;');
                  console.error('%c🔗 https://github.com/Theguardians58/Notre-', 'color: blue; font-size: 12px;');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white text-black dark:bg-gray-900 dark:text-white overflow-x-hidden">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
