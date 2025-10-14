import type { Metadata } from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const firaCode = Fira_Code({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Coefficient: The Science of Growth',
  description: 'Interactive Marketing Strategy Simulator - Master the mathematical foundations of growth through immersive simulation',
  keywords: ['marketing strategy', 'MMM', 'attribution modeling', 'growth simulation', 'marketing mix modeling'],
  authors: [{ name: 'Jacob Darling' }],
  openGraph: {
    title: 'Coefficient: The Science of Growth',
    description: 'Interactive Marketing Strategy Simulator - Master the mathematical foundations of growth',
    type: 'website',
    url: 'https://coefficient.vercel.app',
    siteName: 'Coefficient',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coefficient: The Science of Growth',
    description: 'Interactive Marketing Strategy Simulator - Master the mathematical foundations of growth',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} ${firaCode.variable} font-sans`}>
        <ThemeProvider>
          <div className="aurora-bg" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
