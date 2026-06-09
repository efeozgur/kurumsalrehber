import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/lib/theme';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import './globals.css';

export const metadata: Metadata = {
  title: 'Burdur Adliyesi Telefon Rehberi',
  description: 'Burdur Adliyesi Telefon Rehberi Sistemi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <ThemeSwitcher />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
