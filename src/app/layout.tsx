import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import { AuthProvider } from '@/components/auth/auth-provider';
import Topbar from '@/components/layout/topbar';
import Footer from '@/components/layout/footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HobbyFind - 나에게 맞는 취미 찾기',
  description: '당신의 성향에 맞는 완벽한 취미를 찾아보세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-white`}
      >
        <Providers>
          <AuthProvider>
            <Topbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
